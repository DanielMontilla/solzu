import { describe, it, expect, vi } from "vitest";
import { Either, Left, Right } from "../..";

describe("Either", () => {
  describe("unwrapLeft", () => {
    it("should return the Left value", () => {
      const left = Either.Left("Error");
      expect(left.unwrapLeft()).toBe("Error");
    });

    it("should throw if the Either is Right", () => {
      const right = Either.Right("Success");
      expect(() => right.unwrapLeft()).toThrow();
    });
  });

  describe("unwrapRight", () => {
    it("should return the Right value", () => {
      const right = Either.Right("Success");
      expect(right.unwrapRight()).toBe("Success");
    });

    it("should throw if the Either is Left", () => {
      const left = Either.Left("Error");
      expect(() => left.unwrapRight()).toThrow();
    });
  });

  describe("isLeft", () => {
    it("should return true if the Either is Left", () => {
      const left = Either.Left("Error");
      expect(left.isLeft()).toBe(true);
    });

    it("should return false if the Either is Right", () => {
      const right = Either.Right("Success");
      expect(right.isLeft()).toBe(false);
    });
  });

  describe("isRight", () => {
    it("should return true if the Either is Right", () => {
      const right = Either.Right("Success");
      expect(right.isRight()).toBe(true);
    });

    it("should return false if the Either is Left", () => {
      const left = Either.Left("Error");
      expect(left.isRight()).toBe(false);
    });
  });

  describe("onLeft", () => {
    it("should execute the function if the Either is Left", () => {
      const left = Either.Left("Error");
      const mockFn = vi.fn();
      left.onLeft(mockFn);
      expect(mockFn).toHaveBeenCalledWith("Error");
    });

    it("should not execute the function if the Either is Right", () => {
      const right = Either.Right("Success");
      const mockFn = vi.fn();
      right.onLeft(mockFn);
      expect(mockFn).not.toHaveBeenCalled();
    });
  });

  describe("onRight", () => {
    it("should execute the function if the Either is Right", () => {
      const right = Either.Right("Success");
      const mockFn = vi.fn();
      right.onRight(mockFn);
      expect(mockFn).toHaveBeenCalledWith("Success");
    });

    it("should not execute the function if the Either is Left", () => {
      const left = Either.Left("Error");
      const mockFn = vi.fn();
      left.onRight(mockFn);
      expect(mockFn).not.toHaveBeenCalled();
    });
  });

  describe("swap", () => {
    it("should swap Left to Right", () => {
      const left = Either.Left("Error");
      const swapped = left.swap();
      expect(swapped.isRight()).toBe(true);
      expect(swapped.unwrapRight()).toBe("Error");
    });

    it("should swap Right to Left", () => {
      const right = Either.Right("Success");
      const swapped = right.swap();
      expect(swapped.isLeft()).toBe(true);
      expect(swapped.unwrapLeft()).toBe("Success");
    });
  });

  describe("toResult", () => {
    it("should convert Left to Ok", () => {
      const left = Either.Left("Error");
      const result = left.toResult();
      expect(result.isOk()).toBe(true);
      expect(result.takeOk()).toBe("Error");
    });

    it("should convert Right to Err", () => {
      const right = Either.Right("Success");
      const result = right.toResult();
      expect(result.isErr()).toBe(true);
      expect(result.takeErr()).toBe("Success");
    });
  });
  describe("swap", () => {
    it("should swap Left to Right", () => {
      const left = Either.Left("Error");
      const swapped = left.swap();
      expect(swapped).toBeInstanceOf(Right);
      expect(swapped.value).toBe("Error");
    });

    it("should swap Right to Left", () => {
      const right = Either.Right("Success");
      const swapped = right.swap();
      expect(swapped).toBeInstanceOf(Left);
      expect(swapped.value).toBe("Success");
    });
  });
});
