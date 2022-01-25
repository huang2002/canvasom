// @ts-check
/// <reference types=".." />
/// <reference types="3h-test" />
const { Vector } = COM;

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

    vector_add(context) {
        const v = new Vector(10, 11);
        v.add(-5, 1);
        context.assertStrictEqual(v.x, 5);
        context.assertStrictEqual(v.y, 12);
    },

    vector_addVector(context) {
        const v = new Vector(10, 11);
        v.addVector({ x: -5, y: 1 });
        context.assertStrictEqual(v.x, 5);
        context.assertStrictEqual(v.y, 12);
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

    vector_rotate(context) {
        const v = new Vector(1, 1);
        const ACCURACY = 1e-10;
        v.rotate(Math.PI / 4);
        context.assert(Math.abs(v.x) < ACCURACY);
        context.assert(Math.abs(v.y - Math.SQRT2) < ACCURACY);
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

});
