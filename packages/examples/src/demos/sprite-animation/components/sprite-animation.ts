import { AnimationDetails } from '../structures/animation-details';
import { Frame } from '../structures/frame';
import { Component } from '@jakeklassen/ecs';

export class SpriteAnimation extends Component {
  public delta = 0;
  public currentFrame = 0;
  public finished = false;
  public frames: Frame[] = [];

  /**
   * The frame rate of the animation in seconds.
   */
  public frameRate = 0;

  constructor(
    public animationDetails: AnimationDetails,
    public durationMs: number,
    public loop: boolean = true,
    public frameSequence: number[] = [],
  ) {
    super();

    const horizontalFrames =
      animationDetails.width / animationDetails.frameWidth;
    const verticalFrames =
      animationDetails.height / animationDetails.frameHeight;

    for (let i = 0; i < verticalFrames; i++) {
      const sourceY =
        animationDetails.sourceY + i * animationDetails.frameWidth;

      for (let j = 0; j < horizontalFrames; j++) {
        const sourceX =
          animationDetails.sourceX + j * animationDetails.frameHeight;

        this.frames.push(
          new Frame(
            sourceX,
            sourceY,
            animationDetails.frameWidth,
            animationDetails.frameHeight,
          ),
        );
      }
    }

    if (frameSequence.length === 0) {
      this.frameSequence = this.frames.map((_, i) => i);
    }

    // Determine the frame rate based on the duration of the animation
    // and the number of frames.
    // Also divide by 1000 to convert from milliseconds to seconds.
    this.frameRate = this.durationMs / 1_000 / this.frameSequence.length;
  }
}
