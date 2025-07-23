/**
 * ### Objective
 *
 * Imagine you work in Thoughtful’s robotic automation factory, and your objective is to write a function for one of its robotic arms that will dispatch the packages to the correct stack according to their volume and mass.
 *
 * ### Rules
 *
 * Sort the packages using the following criteria:
 *
 * - A package is **bulky** if its volume (Width x Height x Length) is greater than or equal to 1,000,000 cm³ or when one of its dimensions is greater or equal to 150 cm.
 * - A package is **heavy** when its mass is greater or equal to 20 kg.
 *
 * You must dispatch the packages in the following stacks:
 *
 * - **STANDARD**: standard packages (those that are not bulky or heavy) can be handled normally.
 * - **SPECIAL**: packages that are either heavy or bulky can't be handled automatically.
 * - **REJECTED**: packages that are **both** heavy and bulky are rejected.
 *
 * ### Implementation
 *
 * Implement the function **`sort(width, height, length, mass)`** (units are centimeters for the dimensions and kilogram for the mass). This function must return a string: the name of the stack where the package should go.
 */

type RobotStack = 'STANDARD' | 'SPECIAL' | 'REJECTED';

export type Cm = number & { readonly __brand: 'cm' };
export type Kg = number & { readonly __brand: 'kg' };

import fc from 'fast-check';

class Robots {
  public sort(width: Cm, height: Cm, length: Cm, mass: Kg): RobotStack {
    if (width <= 0 || height <= 0 || length <= 0 || mass <= 0) {
      throw new Error('Dimensions and mass must be positive values.');
    }

    const volume = width * height * length;
    const isBulky = volume >= 1_000_000 || [width, height, length].some(dimension => dimension >= 150);
    const isHeavy = mass >= 20;

    if (isBulky && isHeavy) {
      return 'REJECTED';
    }

    if (isBulky || isHeavy) {
      return 'SPECIAL';
    }

    return 'STANDARD';
  }
}

describe('Robots', () => {
  const maxVolumeCubeRoot = Math.floor(Math.cbrt(1_000_000));

  const robots = new Robots();

  it('when dimensions are less than max volume it is standard', () => {
    // validate that the maximum volume is 1,000,000 cm³
    const maxVolumeCubeRoot = Math.floor(Math.cbrt(1_000_000));

    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: maxVolumeCubeRoot }),
        fc.integer({ min: 1, max: maxVolumeCubeRoot }),
        fc.integer({
          min: 1,
          max: maxVolumeCubeRoot,
        }),
        fc.integer({ min: 1, max: 19 }),
        (width: number, height: number, length: number, mass: number) => {
          expect(robots.sort(width as Cm, height as Cm, length as Cm, mass as Kg)).toEqual('STANDARD');
        }
      )
    );
  });

  it('when mass is greater than 20 it is special', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: maxVolumeCubeRoot }),
        fc.integer({ min: 1, max: maxVolumeCubeRoot }),
        fc.integer({
          min: 1,
          max: maxVolumeCubeRoot,
        }),
        fc.integer({ min: 20, max: 200 }),
        (width: number, height: number, length: number, mass: number) => {
          expect(robots.sort(width as Cm, height as Cm, length as Cm, mass as Kg)).toEqual('SPECIAL');
        }
      )
    );
  });

  it('raises an error if any dimension is zero', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: -200, max: maxVolumeCubeRoot }),
        fc.integer({ min: -200, max: maxVolumeCubeRoot }),
        fc.integer({
          min: -200,
          max: maxVolumeCubeRoot,
        }),
        fc.integer({ min: -200, max: 200 }),
        (width: number, height: number, length: number, mass: number) => {
          if (width <= 0 || height <= 0 || length <= 0 || mass <= 0) {
            expect(() =>
              expect(robots.sort(width as Cm, height as Cm, length as Cm, mass as Kg)).toEqual('SPECIAL')
            ).toThrow(/Dimensions and mass must be positive values/);
          }
        }
      )
    );
  });

  it('when any one dimension is greater than 150 it is bulky when the mass is still less than bulky', () => {
    const bulkDimension = { min: 150, max: 200 };
    const standardDimension = { min: 1, max: 150 };

    for (let i = 0; i <= 2; i++) {
      const width = i === 0 ? bulkDimension : standardDimension;
      const height = i === 1 ? bulkDimension : standardDimension;
      const length = i === 2 ? bulkDimension : standardDimension;

      fc.assert(
        fc.property(
          fc.integer(width),
          fc.integer(height),
          fc.integer(length),
          fc.integer({ min: 1, max: 19 }),
          (width: number, height: number, length: number, mass: number) => {
            expect(robots.sort(width as Cm, height as Cm, length as Cm, mass as Kg)).toEqual('SPECIAL');
          }
        )
      );
    }
  });

  it('when mass is greater than and a bulk dimension exists it is rejected', () => {
    const bulkDimension = { min: 150, max: 200 };
    const standardDimension = { min: 1, max: 150 };

    for (let i = 0; i <= 2; i++) {
      const width = i === 0 ? bulkDimension : standardDimension;
      const height = i === 1 ? bulkDimension : standardDimension;
      const length = i === 2 ? bulkDimension : standardDimension;

      fc.assert(
        fc.property(
          fc.integer(width),
          fc.integer(height),
          fc.integer(length),
          fc.integer({ min: 20, max: 200 }),
          (width: number, height: number, length: number, mass: number) => {
            expect(robots.sort(width as Cm, height as Cm, length as Cm, mass as Kg)).toEqual('REJECTED');
          }
        )
      );
    }
  });
});
