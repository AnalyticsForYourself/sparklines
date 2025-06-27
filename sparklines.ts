
function validate(sparkline: SparkLines, opts: Record<string, number|number[]|SVGElement|string|string[]>) {
	if (!Array.isArray(opts.colors)) {
		opts.colors = sparkline.colors;
	}

	if (!opts.points) { return }
	sparkline.innerHTML = '';
	opts.points = (opts.points as string[]).map(item => parseInt(item, 10));
}

function parseIntWithDefault(val, defaultValue) {
	let parsed = parseInt(val, 10);
	return isNaN(parsed) ? defaultValue : parsed;
}

class SparkLines extends HTMLElement {
	get points(): number[] {
		return JSON.parse(this.getAttribute('points') ?? '[]');
	}
	get type() {
		return this.getAttribute('type');
	}
	get colors() {
		return ['gray']
	}
	#setup() {

		let defaultOpts = {
			svg: document.createElementNS('http://www.w3.org/2000/svg', 'svg'),
			width: parseIntWithDefault(this.dataset.width, 100),
			height: parseIntWithDefault(this.dataset.height, 30),
			gap: parseIntWithDefault(this.dataset.gap, 5),
			strokeWidth: parseIntWithDefault(this.dataset.strokeWidth, 2),
			type: this.type || 'bar',
			colors: this.colors || ['gray'],
			points: this.points,
			labels: null,
			format: null,
		};

		defaultOpts.svg.setAttribute('width', defaultOpts.width);
		defaultOpts.svg.setAttribute('height', defaultOpts.height);

		return defaultOpts
	}

	#line(opts) {
		const spacing = opts.width / (opts.points.length - 1);
		const maxValue = Math.max(...opts.points);

		const pointsCoords:string[] = [];
		opts.points.forEach((point:number, idx:number) => {
			const maxHeight = (point / maxValue) * opts.height;
			const x = idx * spacing;
			const y = opts.height - maxHeight;
			pointsCoords.push(`${x},${y}`);
		});

		const line = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
		line.setAttribute('points', pointsCoords.join(' '));
		line.setAttribute('fill', 'none');
		line.setAttribute('stroke-width', opts.strokeWidth);
		line.setAttribute('stroke', opts.colors[0]);
		opts.svg.appendChild(line);

		this.appendChild(opts.svg);
	}
	connectedCallback() {
		const opts = this.#setup();
		this.#line(opts)
	}
}
