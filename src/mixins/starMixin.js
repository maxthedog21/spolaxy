const starMixin = {
    data() {
        return {
            canvas: null,
            ctx: null,
            starList: [],
            now: 0,
            dt: 0,
            last: 0,
            elaspedTime: 0,
        };
    },
    methods: {
        updateCanvasSize() {
            this.canvas.width = document.body.offsetWidth;
            this.canvas.height = document.body.offsetHeight;
        },
        timestamp() {
            return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
        },
        clearRectangle() {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        },
        drawRectangle() {
            this.ctx.fillStyle = "black";
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        },
        drawStars() {
            this.starList.forEach((star, index) => {
                this.ctx.beginPath()
                this.ctx.arc(star.x, star.y, star.size, 0, 2 * Math.PI, false)
                this.ctx.fillStyle = "white";
                this.ctx.shadowBlur = 8;
                this.ctx.shadowColor = "white";
                this.ctx.fill();
                this.ctx.closePath();
            });
        },
        runStars() {
            this.now = this.timestamp();
            this.dt = (this.now - this.last) / 1000;
            this.elaspedTime += this.dt;
            this.clearRectangle();
            this.drawStars();
            this.updateStars();
            this.elaspedTime = 0;
            this.last = this.now;
            window.requestAnimationFrame(this.runStars);
        },
        runStarsMixin(){
            this.now = this.timestamp();
            this.dt = (this.now - this.last) / 1000;
            this.elaspedTime += this.dt;
            this.drawStars();
            this.updateStars();
            this.elaspedTime = 0;
            this.last = this.now;
        },
        updateStars() {
            this.starList = this.starList.map((star) => {
                if (star.growing) {
                    star.size += 0.02;
                    star.growing = star.size < 2;
                } else {
                    if (star.size < 0.26) {
                        star.growing = true;
                    } else {
                        star.size -= 0.02;
                    }

                }
                return star;
            });
        },
        generateStars(num) {
            let i = 0;
            const mX = this.canvas.width;
            const mY = this.canvas.height
            while (i < num) {
                let star = {
                    x: Math.floor(Math.random() * mX),
                    y: Math.floor(Math.random() * mY),
                    size: Math.floor(Math.random() * 2),
                    shawdowSize: Math.floor(Math.random() * 11),
                    growing: Math.floor(Math.random() * 2) === 1 ? true : false,
                };
                this.starList.push(star);
                i++;
            }
        },
    }
}

export default starMixin;