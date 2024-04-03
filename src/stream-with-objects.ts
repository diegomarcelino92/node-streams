import { Readable, Transform, Writable } from "stream";

const list = Array.from({ length: 1000 }).map(() =>
  Array.from({ length: 10 }).map((_, i) => ({
    name: `test-${i}`,
    surname: `test-surname-${i}`,
  }))
);

class Pipe1 extends Readable {
  constructor() {
    super({ objectMode: true });
  }

  _read() {}

  async start() {
    for (const item of list) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      this.push(item);
    }

    this.push(null);
  }
}

class Pipe2 extends Transform {
  constructor() {
    super({ objectMode: true });
  }

  _transform(chunk, encoding, callback) {
    const newChunk = chunk.map((c) => ({
      fullname: c.name + " " + c.surname,
    }));

    this.push(newChunk);
    callback();
  }
}

class Pipe3 extends Writable {
  constructor() {
    super({ objectMode: true });
  }

  _write(chunk, encoding, callback) {
    console.log(chunk);
    callback();
  }
}

const pipe1 = new Pipe1();
const pipe2 = new Pipe2();
const pipe3 = new Pipe3();
pipe1.pipe(pipe2).pipe(pipe3);

console.time("time");
pipe1.start();
pipe1.on("end", () => console.timeEnd("time"));
