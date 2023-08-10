// SETUP 
const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// COLOR 
const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
gradient.addColorStop(0, 'white');
gradient.addColorStop(0.5, 'red');
gradient.addColorStop(1, 'blue');
ctx.fillStyle = gradient;
ctx.strokeStyle = 'white';

class Particle {
    constructor(effect) {
        this.effect = effect;
        this.radius = Math.random() * 5 + 2;
        this.x = this.radius + Math.random() * (this.effect.width - this.radius * 2);
        this.y = this.radius + Math.random() * (this.effect.height - this.radius * 2);
        this.vx = Math.random() * 3 - 2;
        this.vy = Math.random() * 3 - 2;
    }

    draw(context) {
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        context.fill();
        context.stroke();
    }

    updatePostion() {
        this.x += this.vx;
        if (this.x > this.effect.width - this.radius || this.x < this.radius) this.vx *= -1;

        this.y += this.vy;
        if (this.y > this.effect.height - this.radius || this.y < this.radius) this.vy *= -1;
    }

}

class Effect {
    constructor(canvas) {
        this.canvas = canvas;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.particles = [];
        this.numberOfParticles = 150;
        // init the creation of particles 
        this.createParticles();
    }

    createParticles() {
        for (let i = 0; i < this.numberOfParticles; i++) {
            this.particles.push(new Particle(this));

        }
    }

    handleParticles(context) {
        this.connectParticles(context);
        this.particles.forEach(particle => {
            particle.draw(context);
            particle.updatePostion(context);
        });
    }

    connectParticles(context) {
        const maxDistance = 100;
        for (let a = 0; a < this.particles.length; a++) {
            // b -> empieza por a para no repetir elementos.
            for (let b = a; b < this.particles.length; b++) {
                const dx = this.particles[a].x - this.particles[b].x;
                const dy = this.particles[a].y - this.particles[b].y;
                // to get the distance between 2 points we needd to apply pitagoras using distance in X and Y
                const distance = Math.hypot(dx, dy);

                if (distance < maxDistance) {
                    // context.save();
                    const opacity = 1 - (distance / maxDistance); // distance = 0 - 99 / 100 -> 0.1, 0.5, 1
                    context.globalAlpha = opacity;
                    this.drawLinesBetweenTwoParticles(context, this.particles[a], this.particles[b]);
                    // context.restore();
                }

            }

        }
    }

    drawLinesBetweenTwoParticles(context, particleA, particleB) {
        context.beginPath();
        //draw a line from particle A 
        context.moveTo(particleA.x, particleA.y);
        //and end the line in particlle B 
        context.lineTo(particleB.x, particleB.y);
        context.stroke();
    }

}

const effect = new Effect(canvas);

console.log(effect);
function animate() {
    // TO clear the canvas every time this animations is trigger
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    effect.handleParticles(ctx);
    requestAnimationFrame(animate)
}

animate();