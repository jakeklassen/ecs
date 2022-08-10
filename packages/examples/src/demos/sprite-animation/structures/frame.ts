/**
 * This represents a frame of a sprite sheet.
 */
export class Frame {
  constructor(
    public sourceX: number,
    public sourceY: number,
    public width: number,
    public height: number,
  ) {}
}
