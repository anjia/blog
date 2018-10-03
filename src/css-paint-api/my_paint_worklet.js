class CheckerboardPainter {
	// inputProperties 返回一个 paint() 可以访问的 CSS 属性列表
	static get inputProperties() {
		return ['--checkerboard-spacing', '--checkerboard-size'];
	}

	paint(ctx, geom, properties) {
		// Paint worklet 使用 CSS Typed OM 来取输入参数的值
		const size = parseInt(properties.get('--checkerboard-size').toString()) || 30;
		const spacing = parseInt(properties.get('--checkerboard-spacing').toString()) || 10;
		const colors = ['red', 'green', 'blue'];
		for(let y = 0; y < geom.height/size; y++) {
			for(let x = 0; x < geom.width/size; x++) {
				ctx.fillStyle = colors[(x + y) % colors.length];
				ctx.beginPath();
				ctx.rect(x*(size + spacing), y*(size + spacing), size, size);
				ctx.fill();
			}
		}
	}
}
registerPaint('checkerboard', CheckerboardPainter);