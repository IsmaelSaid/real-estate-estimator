import {
  euclideanDistance,
  harvesineDistance,
  mutationDistance,
} from "./distances";
import { trainingData } from "@/app/models/TestsData";

// Extracting training data
const { X_train, target, Y_train } = trainingData;

/**
 * Test suite for the euclideanDistance function.
 * It tests the function with short distances.
 */
describe("euclideanDistance", () => {
  it("should calculate correct distance for given coordinates (short distances)", () => {
    // Define coordinates
    const coord1 = [target.longitude, target.latitude];
    const coord2 = [X_train[0].longitude, X_train[0].latitude];

    // Calculate euclidean distance
    const result = euclideanDistance(coord2, coord1);

    // Calculate harvesine distance
    const harvesine = harvesineDistance(coord1, coord2);

    // Assert that the result is close to .320
    expect(result).toBeCloseTo(0.32);
  });
});

/**
 * Test suite for the mutationDistance function.
 * It tests the function with given mutations.
 */
describe("Mutation distances", () => {
  it("should calculate correct distance for given mutations", () => {
    // Calculate mutation distance
    const result = mutationDistance(target, X_train[0], harvesineDistance);

    // Assert that the result is close to .320
    expect(result).toBeCloseTo(0.32);
  });
});
