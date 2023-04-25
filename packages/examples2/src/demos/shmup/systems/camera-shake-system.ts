import { World } from '@jakeklassen/ecs2';
import { Entity } from '../entity.js';

export function cameraShakeSystemFactory({
  camera,
  world,
}: {
  camera: { x: number; y: number };
  world: World<Entity>;
}) {
  const cameraShakeEvents = world.archetype('eventTriggerCameraShake');

  return function cameraShake(dt: number) {
    for (const entity of cameraShakeEvents.entities) {
      const { eventTriggerCameraShake } = entity;

      eventTriggerCameraShake.durationMs -= dt * 1000;

      if (eventTriggerCameraShake.durationMs > 0) {
        camera.x = eventTriggerCameraShake.strength * (Math.random() - 0.5);
        camera.y = eventTriggerCameraShake.strength * (Math.random() - 0.5);
      } else {
        camera.x = 0;
        camera.y = 0;

        world.deleteEntity(entity);
      }
    }
  };
}
