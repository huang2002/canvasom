// @ts-check
/// <reference types=".." />
/// <reference types="3h-test" />
const { Vector } = COM;

const ALMOST_EQUAL_ACCURACY = 1e-10;

/**
 * @param {number} a
 * @param {number} b
 */
const almostEqual = (a, b) => (Math.abs(a - b) < ALMOST_EQUAL_ACCURACY);

T.test(null, {

    Vector_constructor(context) {
        const v1 = new Vector();
        context.assertStrictEqual(v1.x, 0);
        context.assertStrictEqual(v1.y, 0);
        const v2 = new Vector(2000, 2);
        context.assertStrictEqual(v2.x, 2000);
        context.assertStrictEqual(v2.y, 2);
    },

    Vector_from(context) {
        const x = 10;
        const y = 11;
        const v = Vector.from({ x, y });
        context.assert(v instanceof Vector);
        context.assertStrictEqual(v.x, x);
        context.assertStrictEqual(v.y, y);
    },

    Vector_random(context) {
        for (let i = 0; i < 1e3; i++) {
            const v = Vector.random(0, Math.PI);
            context.assert(v.x <= 1);
            context.assert(v.y >= 0);
            context.assert(almostEqual(v.norm, 1));
        }
    },

    Vector_distribute(context) {
        const v0 = new Vector(12, 24);
        const v1 = new Vector(1, 2);
        const v2 = new Vector(10, 11);
        Vector.distribute(v0, v1, v2, 1, -2);
        context.assertStrictEqual(v0.x, 12);
        context.assertStrictEqual(v0.y, 24);
        context.assertStrictEqual(v1.x, 5);
        context.assertStrictEqual(v1.y, 10);
        context.assertStrictEqual(v2.x, 2);
        context.assertStrictEqual(v2.y, -5);
    },

    Vector_distance(context) {
        const v1 = new Vector(-1, 2);
        const v2 = new Vector(2, 6);
        context.assertStrictEqual(Vector.distance(v1, v2), 5);
    },

    vector_norm_get(context) {
        const v = new Vector(3, 4);
        context.assertStrictEqual(v.norm, 5);
    },

    vector_norm_set_nonzero(context) {
        const v = new Vector(3, 4);
        v.norm = 10;
        context.assertStrictEqual(v.x, 6);
        context.assertStrictEqual(v.y, 8);
    },

    vector_norm_set_zero(context) {
        const v = new Vector(3, 4);
        v.norm = 0;
        context.assertStrictEqual(v.x, 0);
        context.assertStrictEqual(v.y, 0);
    },

    vector_clone(context) {
        const v = new Vector(5, 12);
        const _v = v.clone();
        context.assert(v !== _v);
        context.assertStrictEqual(v.x, _v.x);
        context.assertStrictEqual(v.y, _v.y);
        v.x = -5;
        _v.y = -12;
        context.assertStrictEqual(_v.x, 5);
        context.assertStrictEqual(v.y, 12);
    },

    vector_normalize(context) {
        const v = new Vector(3, -4);
        v.normalize();
        context.assert(almostEqual(v.x, 0.6));
        context.assert(almostEqual(v.y, -0.8));
    },

    vector_isZero(context) {
        const v0 = new Vector(0, 0);
        const v1 = new Vector(0, 1);
        const v2 = new Vector(1, 0);
        const v3 = new Vector(1, 1);
        context.assertStrictEqual(v0.isZero(), true);
        context.assertStrictEqual(v1.isZero(), false);
        context.assertStrictEqual(v2.isZero(), false);
        context.assertStrictEqual(v3.isZero(), false);
    },

    vector_set(context) {
        const v = new Vector(10, 11);
        v.set(3, 4);
        context.assertStrictEqual(v.x, 3);
        context.assertStrictEqual(v.y, 4);
    },

    vector_setVector(context) {
        const v = new Vector(10, 11);
        v.setVector({ x: 3, y: 4 });
        context.assertStrictEqual(v.x, 3);
        context.assertStrictEqual(v.y, 4);
    },

    vector_add(context) {
        const v = new Vector(10, 11);
        v.add(-5, 1);
        context.assertStrictEqual(v.x, 5);
        context.assertStrictEqual(v.y, 12);
    },

    vector_addVector(context) {
        const v1 = new Vector(10, 11);
        const v2 = new Vector(10, 11);
        v1.addVector({ x: -5, y: 1 });
        v2.addVector({ x: -5, y: 1 }, 2);
        context.assertStrictEqual(v1.x, 5);
        context.assertStrictEqual(v1.y, 12);
        context.assertStrictEqual(v2.x, 0);
        context.assertStrictEqual(v2.y, 13);
    },

    vector_sub(context) {
        const v = new Vector(10, 11);
        v.sub(5, -1);
        context.assertStrictEqual(v.x, 5);
        context.assertStrictEqual(v.y, 12);
    },

    vector_subVector(context) {
        const v1 = new Vector(10, 11);
        const v2 = new Vector(10, 11);
        v1.subVector({ x: 5, y: -1 });
        v2.subVector({ x: 5, y: -1 }, 2);
        context.assertStrictEqual(v1.x, 5);
        context.assertStrictEqual(v1.y, 12);
        context.assertStrictEqual(v2.x, 0);
        context.assertStrictEqual(v2.y, 13);
    },

    vector_scale(context) {
        const v = new Vector(1, 1);
        v.scale(2, -1);
        context.assertStrictEqual(v.x, 2);
        context.assertStrictEqual(v.y, -1);
        v.scale(2);
        context.assertStrictEqual(v.x, 4);
        context.assertStrictEqual(v.y, -2);
    },

    vector_scaleVector(context) {
        const v = new Vector(1, 1);
        v.scaleVector({ x: 2, y: -1 });
        context.assertStrictEqual(v.x, 2);
        context.assertStrictEqual(v.y, -1);
    },

    vector_reverse(context) {
        const v = new Vector(3, -4);
        v.reverse();
        context.assertStrictEqual(v.x, -3);
        context.assertStrictEqual(v.y, 4);
    },

    vector_rotate(context) {
        const v = new Vector(1, 1);
        v.rotate(Math.PI / 4);
        context.assert(almostEqual(v.x, 0));
        context.assert(almostEqual(v.y, Math.SQRT2));
    },

    vector_tangent(context) {
        const v = new Vector(1, 0);
        v.tangent();
        context.assertStrictEqual(v.x, 0);
        context.assertStrictEqual(v.y, 1);
        v.tangent(true);
        context.assertStrictEqual(v.x, 1);
        context.assertStrictEqual(v.y, 0);
    },

    vector_dot(context) {
        const v1 = new Vector(1, 2);
        const v2 = new Vector(3, 4);
        context.assertStrictEqual(v1.dot(v2), 11);
        context.assertStrictEqual(v1.dot(v1), 5);
    },

    vector_cross(context) {
        const v1 = new Vector(1, 2);
        const v2 = new Vector(3, 4);
        context.assertStrictEqual(v1.cross(v2), -2);
        context.assertStrictEqual(v2.cross(v1), 2);
        context.assertStrictEqual(v1.cross(v1), 0);
    },

    vector_project(context) {
        const v = new Vector(2, 0);
        const d1 = new Vector(1, 1);
        const d2 = new Vector(0, -1);
        context.assert(almostEqual(v.project(d1), Math.SQRT2));
        context.assert(almostEqual(v.project(d2), 0));
    },

    vector_projectVector(context) {
        const v0 = new Vector(2, 0);
        const d1 = new Vector(1, 1);
        const d2 = new Vector(0, -1);
        const v1 = v0.projectVector(d1);
        context.assert(almostEqual(v1.x, 1));
        context.assert(almostEqual(v1.y, 1));
        const v2 = v0.projectVector(d2);
        context.assert(almostEqual(v2.x, 0));
        context.assert(almostEqual(v2.y, 0));
    },

    vector_toString(context) {
        const v = new Vector(1.1, 2.2);
        context.assertStrictEqual(v.toString(), '1,2');
        context.assertStrictEqual(v.toString(1), '1.1,2.2');
        context.assertStrictEqual(v.toString(2), '1.10,2.20');
        context.assertStrictEqual(String(v), '1,2');
    },

});
