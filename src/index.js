import Phaser from 'phaser';
import bgImg1 from "./assets/background.png";
import playerImg from "./assets/player.png";
import io from 'socket.io-client';

class MyGame extends Phaser.Scene {
    constructor() {
        super();
        this.otherPlayers = {};
        this.lastPosition = { x: 0, y: 0 };
        this.nickname = ''; // 사용자 닉네임
    }

    preload() {
        this.load.image("background1", bgImg1);
        this.load.spritesheet("player", playerImg, {
            frameWidth: 32,
            frameHeight: 36,
        });
    }

    create() {
        this.background1 = this.add.image(0, 0, "background1").setOrigin(0, 0);
        this.player = this.add.sprite(this.sys.game.config.width / 2, this.sys.game.config.height / 2, "player");

        this.anims.create({
            key: "player_anim",
            frames: this.anims.generateFrameNumbers("player"),
            frameRate: 12,
            repeat: -1,
        });

        this.anims.create({
            key: "player_idle",
            frames: this.anims.generateFrameNumbers("player", { start: 0, end: 0 }),
            frameRate: 1,
            repeat: 0,
        });

        this.add.text(10, 10, "'위니브 월드 : 새로운 시대'에 오신 것을 환영합니다.", {
            font: '25px 배달의민족 주아 OTF',
            fill: '#f5e99f'
        });

        this.player.play("player_anim");
        this.keyboardInput = this.input.keyboard.createCursorKeys();
        this.player.m_moving = false;

        // this.socket = io('http://localhost:3000');
        this.socket = io('https://port-0-nest-socket-test-euegqv2lloh4rpfv.sel5.cloudtype.app');

        // 캐릭터 머리 위에 닉네임을 표시하기 위한 텍스트 스타일
        const nameTextStyle = {
            font: 'bold 16px Arial',
            fill: '#ffffff',
            backgroundColor: 'rgba(0, 0, 0, 0.7)', // 닉네임 배경색
            padding: {
                x: 8,
                y: 4,
            },
        };

        this.socket.on('players', (players) => {
            Object.keys(players).forEach(id => {
                if (id === this.socket.id) {
                    return;
                }
                if (this.otherPlayers[id]) {
                    // 플레이어 위치 업데이트
                    this.otherPlayers[id].sprite.x = players[id].x;
                    this.otherPlayers[id].sprite.y = players[id].y;
                    // 플레이어 닉네임 업데이트
                    this.otherPlayers[id].nameText.setPosition(players[id].x, players[id].y - 50);
                    this.otherPlayers[id].nameText.setText(players[id].nickname);
                } else {
                    // 새 플레이어 생성
                    const newPlayer = this.add.sprite(players[id].x, players[id].y, 'player');
                    newPlayer.play('player_anim');
                    const nameText = this.add.text(players[id].x, players[id].y - 50, players[id].nickname, nameTextStyle).setOrigin(0.5, 1.5);
                    this.otherPlayers[id] = { sprite: newPlayer, nameText: nameText };
                }
            });
        });

        this.setupChat();
    }

    setupChat() {
        const chatDiv = document.createElement('div');
        chatDiv.id = 'chat';
        chatDiv.innerHTML = `
            <div id="messages" style="height: 200px; overflow-y: scroll;"></div>
            <input type="text" id="nickname" placeholder="닉네임" />
            <input type="text" id="chat-input" placeholder="메시지 입력" />
            <button id="send-button">보내기</button>
        `;
        document.body.appendChild(chatDiv);

        const nicknameInput = document.getElementById('nickname');
        const chatInput = document.getElementById('chat-input');
        const sendButton = document.getElementById('send-button');
        const messagesDiv = document.getElementById('messages');

        sendButton.addEventListener('click', () => {
            this.nickname = nicknameInput.value.trim();
            const message = chatInput.value.trim();
            chatInput.value = '';
            if (this.nickname && message) {
                this.socket.emit('chatMessage', { nickname: this.nickname, message });
            }
        });

        this.socket.on('chatMessage', (data) => {
            const messageElement = document.createElement('div');
            messageElement.textContent = `${data.nickname}: ${data.message}`;
            messagesDiv.appendChild(messageElement);
            messagesDiv.scrollTop = messagesDiv.scrollHeight;
        });
    }

    update() {
        this.movePlayer();
        this.updatePlayerName();
    }

    movePlayer() {
        const PLAYER_SPEED = 10;
        let moved = false;

        if (this.keyboardInput.left.isDown) {
            this.player.x -= PLAYER_SPEED;
            this.player.flipX = false;
            moved = true;
        } else if (this.keyboardInput.right.isDown) {
            this.player.x += PLAYER_SPEED;
            this.player.flipX = true;
            moved = true;
        }

        if (this.keyboardInput.up.isDown) {
            this.player.y -= PLAYER_SPEED;
            moved = true;
        } else if (this.keyboardInput.down.isDown) {
            this.player.y += PLAYER_SPEED;
            moved = true;
        }

        if (moved) {
            if (this.player.x !== this.lastPosition.x || this.player.y !== this.lastPosition.y) {
                this.socket.emit('move', { x: this.player.x, y: this.player.y });
                this.lastPosition = { x: this.player.x, y: this.player.y };
                this.updatePlayerName();
            }
        }
    }

    updatePlayerName() {
        // 플레이어 이름을 플레이어 위치 위에 업데이트
        if (!this.playerNameText) {
            this.playerNameText = this.add.text(this.player.x, this.player.y, this.nickname, { 
                font: 'bold 16px Arial', 
                fill: '#ffffff' 
            }).setOrigin(0.5, 1.5);
        } else {
            this.playerNameText.setPosition(this.player.x, this.player.y - 50); // 50은 캐릭터 위에 표시되는 높이
            this.playerNameText.setText(this.nickname);
        }
    }
}

const config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    backgroundColor: 0x000000,
    physics: {
        default: "arcade",
        arcade: {
            debug: true,
        },
    },
    scene: MyGame
};

const game = new Phaser.Game(config);
