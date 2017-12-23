import * as PIXI from 'pixi.js';
let Point = PIXI.Point;

const tempPoint = new Point();

export function containsPoint(sprite, point) {
    sprite.worldTransform.applyInverse(point, tempPoint);

    const width = sprite._texture.orig.width;
    const height = sprite._texture.orig.height;

    const x1 = sprite.x;
    let y1 = 0;
    if (tempPoint.x >= x1 && tempPoint.x < x1 + width) {
        y1 = sprite.y;
        if (tempPoint.y >= y1 && tempPoint.y < y1 + height) {
            return true;
        }
    }
    return false;
}