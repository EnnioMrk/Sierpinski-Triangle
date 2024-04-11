//Sierpinski-Triangle
document.addEventListener('DOMContentLoaded', function () {
    let canvas = document.getElementById('mainCNV');
    let ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let points = [];

    // Creating a GUI and a subfolder.
    var gui = new dat.GUI({ name: 'Settings' });

    // Add a number controller slider.
    let settingsOrg = { edgeClose: 4, quality: 5 };
    const settings = new Proxy(settingsOrg, {
        set(target, prop, value) {
            console.log('Value updated');
            target[prop] = value;
            ctx.clearRect(0, 0, width, height);
            points = [];
            calcTrg(); // Call the update function here
            return true;
        },
    });
    gui.add(settings, 'edgeClose', 2, 20);
    gui.add(settings, 'quality', 1, 20);

    class Point {
        constructor(x, y) {
            this.x = x;
            this.y = y;
        }
        randHalfwayPnt(trg) {
            //select random vertecie in triangle
            let r = Math.floor(Math.random() * 3);
            let x = (this.x + trg.vertecies[r].x) / 2;
            let y = (this.y + trg.vertecies[r].y) / 2;
            return new Point(x, y);
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, 1, 0, 2 * Math.PI);
            ctx.fill();
        }
    }

    class Triangle {
        constructor(p1, p2, p3) {
            this.vertecies = [p1, p2, p3];
        }
        draw() {
            ctx.beginPath();
            ctx.moveTo(this.vertecies[0].x, this.vertecies[0].y);
            ctx.lineTo(this.vertecies[1].x, this.vertecies[1].y);
            ctx.lineTo(this.vertecies[2].x, this.vertecies[2].y);
            ctx.closePath();
            ctx.stroke();
        }
        randPntInTrg() {
            // P(x) = (1 - sqrt(r1)) * A(x) + (sqrt(r1) * (1 - r2)) * B(x) + (sqrt(r1) * r2) * C(x)
            //P(y) = (1 - sqrt(r1)) * A(y) + (sqrt(r1) * (1 - r2)) * B(y) + (sqrt(r1) * r2) * C(y)
            let r1 = Math.random();
            let r2 = Math.random();
            let x =
                (1 - Math.sqrt(r1)) * this.vertecies[0].x +
                Math.sqrt(r1) * (1 - r2) * this.vertecies[1].x +
                Math.sqrt(r1) * r2 * this.vertecies[2].x;
            let y =
                (1 - Math.sqrt(r1)) * this.vertecies[0].y +
                Math.sqrt(r1) * (1 - r2) * this.vertecies[1].y +
                Math.sqrt(r1) * r2 * this.vertecies[2].y;
            return new Point(x, y);
        }
    }

    function calcTrg() {
        //new triangle
        let p1 = new Point(width / 2, height / settings.edgeClose);
        let p2 = new Point(
            width / settings.edgeClose,
            (height / settings.edgeClose) * (settings.edgeClose - 1)
        );
        let p3 = new Point(
            (width / settings.edgeClose) * (settings.edgeClose - 1),
            (height / settings.edgeClose) * (settings.edgeClose - 1)
        );
        let triangle = new Triangle(p1, p2, p3);
        triangle.draw();

        //new random point
        points.push(triangle.randPntInTrg());

        //random point halfway between random vertecies 300 times
        for (let i = 0; i < settings.quality * 10000; i++) {
            let p = points[points.length - 1];
            if (p == undefined) break;
            p = p.randHalfwayPnt(triangle);
            points.push(p);
        }

        console.log(points);

        points.map((p) => p.draw());
    }

    let prevQuality;

    setInterval(() => {
        if (prevQuality != settings.quality) {
            console.log('Quality updated');
        }
        prevQuality = settings.quality;
    }, 1000);

    calcTrg();
});
