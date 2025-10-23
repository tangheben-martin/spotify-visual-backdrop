export class SmoothValue {
     private current: number;
     private target: number;
     private speed: number;

     constructor(initial: number = 0, speed: number = 0.05) {
       this.current = initial;
       this.target = initial;
       this.speed = speed;
     }

     setTarget(value: number) {
       this.target = value;
     }

     update(): number {
       this.current += (this.target - this.current) * this.speed;
       return this.current;
     }

     getValue(): number {
       return this.current;
     }

     getCurrent(): number {
       return this.current;
     }
   }

   export class SmoothColor {
     private r: SmoothValue;
     private g: SmoothValue;
     private b: SmoothValue;

     constructor(speed: number = 0.05) {
       this.r = new SmoothValue(0.5, speed);
       this.g = new SmoothValue(0.5, speed);
       this.b = new SmoothValue(0.5, speed);
     }

     setTarget(r: number, g: number, b: number) {
       this.r.setTarget(r);
       this.g.setTarget(g);
       this.b.setTarget(b);
     }

     update() {
       return {
         r: this.r.update(),
         g: this.g.update(),
         b: this.b.update(),
       };
     }
   }