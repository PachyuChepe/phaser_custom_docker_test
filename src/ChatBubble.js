// export default class ChatBubble extends Phaser.GameObjects.Container {
// 	constructor(scene, player, nickname, message) {
// 		super(scene, player.x, player.y - 50); // 플레이어 위에 말풍선을 표시하기 위한 위치 조정
// 		this.scene = scene;
// 		this.player = player;

// 		// 텍스트 스타일
// 		this.text = scene.add.text(0, 0, `${nickname}: ${message}`, {
// 			fontFamily: 'Arial',
// 			fontSize: '16px',
// 			fill: '#ffffff', // 배경이 없으므로 흰색 텍스트로 설정
// 			wordWrap: { width: 200 - 20, useAdvancedWrap: true } // 텍스트 내용을 말풍선 크기에 맞게 자동 줄 바꿈
// 		});
// 		this.text.setOrigin(0.5);
// 		this.add(this.text);

// 		// 말풍선을 플레이어 위에 표시
// 		this.setDepth(1); // 적절한 Z 순서를 설정하여 플레이어 위에 표시
// 		scene.add.existing(this);

// 		// 일정 시간 후에 말풍선 제거
// 		scene.time.delayedCall(2000, () => {
// 			this.text.setVisible(false); // 텍스트 가리기
// 			this.destroy(); // 말풍선 제거
// 		});
// 	}

// 	updatePosition() {
// 		// 플레이어의 위치에 따라 말풍선 위치 업데이트
// 		this.setPosition(this.player.x, this.player.y - 50);
// 		this.text.setPosition(0, 0); // 텍스트 위치도 업데이트
// 	}
// }
