import { useEffect, useRef } from "react";

const UseCanvasCursor = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    const context = ctx;

    let running = true;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth - 20;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();

    class Node {
      x = 0;
      y = 0;
      vx = 0;
      vy = 0;
    }

    class Oscillator {
      phase: number;
      offset: number;
      frequency: number;
      amplitude: number;

      constructor(options: Partial<Oscillator> = {}) {
        this.phase = options.phase ?? 0;
        this.offset = options.offset ?? 0;
        this.frequency = options.frequency ?? 0.001;
        this.amplitude = options.amplitude ?? 1;
      }

      update() {
        this.phase += this.frequency;
        return (
          this.offset +
          Math.sin(this.phase) * this.amplitude
        );
      }
    }

    const E = {
      friction: 0.5,
      trails: 20,
      size: 50,
      dampening: 0.25,
      tension: 0.98,
    };

    const pos = {
      x: 0,
      y: 0,
    };

    let lines: Line[] = [];

    class Line {
      nodes: Node[] = [];
      spring: number;
      friction: number;

      constructor(options: { spring: number }) {
        this.spring =
          options.spring + Math.random() * 0.1 - 0.02;

        this.friction =
          E.friction + Math.random() * 0.01 - 0.002;

        for (let i = 0; i < E.size; i++) {
          const node = new Node();

          node.x = pos.x;
          node.y = pos.y;

          this.nodes.push(node);
        }
      }

      update() {
        const first = this.nodes[0];

        first.vx +=
          (pos.x - first.x) * this.spring;

        first.vy +=
          (pos.y - first.y) * this.spring;

        for (let i = 0; i < this.nodes.length; i++) {
          const node = this.nodes[i];

          node.vx *= this.friction;
          node.vy *= this.friction;

          node.x += node.vx;
          node.y += node.vy;
        }
      }

      draw() {
        context.beginPath();

        context.moveTo(
          this.nodes[0].x,
          this.nodes[0].y
        );

        for (let i = 1; i < this.nodes.length; i++) {
          const node = this.nodes[i];

          context.lineTo(node.x, node.y);
        }

        context.stroke();
        context.closePath();
      }
    }


    const oscillator = new Oscillator({
      phase: Math.random() * Math.PI * 2,
      amplitude: 85,
      frequency: 0.0015,
      offset: 285,
    });


    const mouseMove = (e: MouseEvent) => {
      pos.x = e.clientX;
      pos.y = e.clientY;

      if (!lines.length) {
        for (let i = 0; i < E.trails; i++) {
          lines.push(
            new Line({
              spring:
                0.4 +
                (i / E.trails) * 0.025,
            })
          );
        }
      }
    };


    const render = () => {
      if (!running) return;

      context.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
      );

      context.strokeStyle =
        `hsla(${oscillator.update()},50%,50%,0.2)`;

      context.lineWidth = 1;

      lines.forEach((line) => {
        line.update();
        line.draw();
      });

      requestAnimationFrame(render);
    };


    window.addEventListener(
      "resize",
      resizeCanvas
    );

    document.addEventListener(
      "mousemove",
      mouseMove
    );

    render();


    return () => {
      running = false;

      window.removeEventListener(
        "resize",
        resizeCanvas
      );

      document.removeEventListener(
        "mousemove",
        mouseMove
      );
    };

  }, []);


  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
      }}
    />
  );
};

export default UseCanvasCursor;