import { rad2deg } from '#/lib/math.js';
import { World } from '@jakeklassen/ecs2';
import { SetRequired } from 'type-fest';
import { aimedFire, fire } from '../enemy/enemy-bullets.js';
import { Entity } from '../entity.js';
import { TimeSpan, Timer } from '../timer.js';

type Boss = SetRequired<
  Entity,
  | 'boxCollider'
  | 'direction'
  | 'enemyState'
  | 'tagBoss'
  | 'transform'
  | 'velocity'
>;

type Phase = {
  phase: number;
  enter: (args: { boss: Boss }) => void;
  exit: () => void;
  update: (args: { boss: Boss; dt: number; nextPhase: Phase }) => Phase;
};

export function bossSystemFactory({
  timer,
  world,
}: {
  timer: Timer;
  world: World<Entity>;
}) {
  const bosses = world.archetype(
    'boxCollider',
    'direction',
    'enemyState',
    'tagBoss',
    'transform',
    'velocity',
  );

  const players = world.archetype('tagPlayer', 'transform');

  function phase1Factory({ timer }: { timer: Timer }): Phase {
    const phaseTime = new TimeSpan(8_000);
    const fireTime = new TimeSpan(100, 0, true);
    const shotsBeforeGap = 8;
    const shotsBeforeGapReset = 10;
    let shotsFired = 0;

    return {
      phase: 1,

      enter({ boss }: { boss: Boss }) {
        console.log('enter phase 1');

        timer.add(fireTime, () => {
          shotsFired++;

          if (shotsFired <= shotsBeforeGap) {
            fire({
              angle: 0,
              enemy: boss,
              speed: 60,
              triggerSound: true,
              world,
            });
          } else if (shotsFired >= shotsBeforeGapReset) {
            shotsFired = 0;
          }
        });

        boss.direction.x = Math.random() > 0.5 ? 1 : -1;
        boss.velocity.x = 60;
      },
      exit() {
        console.log('exit phase 1');
        timer.remove(fireTime);
      },
      update({
        boss,
        dt,
        nextPhase,
      }: {
        boss: Boss;
        dt: number;
        nextPhase: Phase;
      }) {
        phaseTime.update(dt);

        if (phaseTime.expired) {
          phaseTime.reset();

          this.exit();
          nextPhase.enter({ boss });

          return nextPhase;
        }

        if (boss.transform.position.x >= 93) {
          boss.transform.position.x = 93;

          boss.direction.x = -1;
        } else if (boss.transform.position.x <= 3) {
          boss.transform.position.x = 3;

          boss.direction.x = 1;
        }

        return this;
      },
    };
  }

  function phase2Factory({ timer }: { timer: Timer }): Phase {
    const fireTime = new TimeSpan(500, 0, true);

    return {
      phase: 2,

      enter({ boss }: { boss: Boss }) {
        console.log('enter phase 2');

        boss.direction.x = -1;
        boss.direction.y = 0;
        boss.velocity.x = 30;
        boss.velocity.y = 30;

        timer.add(fireTime, () => {
          const [player] = players.entities;

          if (player == null) {
            return;
          }

          aimedFire({
            enemy: boss,
            target: player.transform,
            world,
          });
        });
      },
      exit() {
        console.log('exit phase 2');

        timer.remove(fireTime);
      },
      update({ boss, nextPhase }: { boss: Boss; nextPhase: Phase }) {
        if (boss.direction.x === -1 && boss.transform.position.x <= 3) {
          boss.transform.position.x = 3;

          boss.direction.x = 0;
          boss.direction.y = 1;
        } else if (boss.direction.y === 1 && boss.transform.position.y >= 100) {
          boss.transform.position.y = 100;

          boss.direction.x = 1;
          boss.direction.y = 0;
        } else if (boss.direction.x === 1 && boss.transform.position.x >= 93) {
          boss.transform.position.x = 93;

          boss.direction.x = 0;
          boss.direction.y = -1;
        } else if (boss.direction.y === -1 && boss.transform.position.y <= 25) {
          boss.transform.position.y = 25;

          boss.direction.y = 0;
          boss.direction.x = 0;

          this.exit();
          nextPhase.enter({ boss });

          return nextPhase;
        }

        return this;
      },
    };
  }

  function phase3Factory({}: { timer: Timer }): Phase {
    const numberOfBullets = 8;
    const phaseTime = new TimeSpan(8_000);
    const fireTime = new TimeSpan(333, 0, true);

    return {
      phase: 3,

      enter({ boss }: { boss: Boss }) {
        console.log('enter phase 3');

        boss.direction.x = -1;
        boss.direction.y = 0;
        boss.velocity.x = 30;
        boss.velocity.y = 30;
      },
      exit() {
        console.log('exit phase 3');
      },
      update({
        boss,
        dt,
        nextPhase,
      }: {
        boss: Boss;
        dt: number;
        nextPhase: Phase;
      }) {
        phaseTime.update(dt);
        fireTime.update(dt);

        if (phaseTime.expired) {
          phaseTime.reset();

          this.exit();
          nextPhase.enter({ boss });

          return nextPhase;
        }

        const [player] = players.entities;

        if (player == null) {
          return this;
        }

        const timeFactor = performance.now() / 1000;
        const angle = ((Math.PI * 2) / numberOfBullets) * timeFactor;

        if (fireTime.expired) {
          fireTime.reset();

          world.createEntity({
            eventPlaySound: {
              track: 'boss-projectile',
              options: {
                loop: false,
              },
            },
          });

          for (let i = 0; i < numberOfBullets; i++) {
            const angleOffset = (Math.PI * 2) / numberOfBullets;
            const circleAngle = angle + angleOffset * i;

            fire({
              angle: rad2deg(circleAngle),
              enemy: boss,
              speed: 60,
              triggerSound: false,
              world,
            });
          }
        }

        if (boss.transform.position.x >= 93) {
          boss.transform.position.x = 93;

          boss.direction.x = -1;
        } else if (boss.transform.position.x <= 3) {
          boss.transform.position.x = 3;

          boss.direction.x = 1;
        }

        return this;
      },
    };
  }

  function phase4Factory({}: { timer: Timer }): Phase {
    const fireTime = new TimeSpan(450, 0, true);

    return {
      phase: 4,

      enter({ boss }: { boss: Boss }) {
        console.log('enter phase 4');

        // Enter this phase moving to the right
        boss.direction.x = 1;
        boss.direction.y = 0;
        boss.velocity.x = 30;
        boss.velocity.y = 30;
      },
      exit() {
        console.log('exit phase 4');
      },
      update({
        boss,
        dt,
        nextPhase,
      }: {
        boss: Boss;
        dt: number;
        nextPhase: Phase;
      }) {
        fireTime.update(dt);

        if (boss.direction.x === 1 && boss.transform.position.x >= 93) {
          boss.transform.position.x = 93;

          boss.direction.x = 0;
          boss.direction.y = 1;
        } else if (boss.direction.y === 1 && boss.transform.position.y >= 100) {
          boss.transform.position.y = 100;

          boss.direction.x = -1;
          boss.direction.y = 0;
        } else if (boss.direction.x === -1 && boss.transform.position.x <= 3) {
          boss.transform.position.x = 3;

          boss.direction.x = 0;
          boss.direction.y = -1;
        } else if (boss.direction.y === -1 && boss.transform.position.y <= 25) {
          boss.transform.position.y = 25;

          boss.direction.y = 0;
          boss.direction.x = 1;

          this.exit();
          nextPhase.enter({ boss });

          return nextPhase;
        }

        if (fireTime.expired) {
          fireTime.reset();

          // Angle 0 is down
          // Angle 90 is right
          // Angle 180 is up
          // Angle 270 is left
          if (boss.direction.x > 0) {
            fire({
              angle: 0,
              enemy: boss,
              speed: 60,
              triggerSound: true,
              world,
            });
          } else if (boss.direction.x < 0) {
            fire({
              angle: 180,
              enemy: boss,
              speed: 60,
              triggerSound: true,
              world,
            });
          } else if (boss.direction.y > 0) {
            fire({
              angle: 270,
              enemy: boss,
              speed: 60,
              triggerSound: true,
              world,
            });
          } else if (boss.direction.y < 0) {
            fire({
              angle: 90,
              enemy: boss,
              speed: 60,
              triggerSound: true,
              world,
            });
          }
        }

        return this;
      },
    };
  }

  const phase1 = phase1Factory({ timer });
  const phase2 = phase2Factory({ timer });
  const phase3 = phase3Factory({ timer });
  const phase4 = phase4Factory({ timer });
  let phase: Phase | null = phase1;

  return function bossSystem(dt: number) {
    const [boss] = bosses.entities;

    if (boss == null || boss.enemyState === 'flyin') {
      if (phase != null) {
        phase.exit();

        phase = null;
      }

      return;
    }

    if (boss.enemyState === 'bossReady') {
      boss.enemyState = 'boss1';

      phase = phase1;
      phase1.enter({ boss });
    }

    if (phase?.phase === 1) {
      phase = phase.update({ boss, dt, nextPhase: phase2 });
    } else if (phase?.phase === 2) {
      phase = phase.update({ boss, dt, nextPhase: phase3 });
    } else if (phase?.phase === 3) {
      phase = phase?.update({ boss, dt, nextPhase: phase4 });
    } else if (phase?.phase === 4) {
      phase = phase.update({ boss, dt, nextPhase: phase1 });
    }
  };
}
