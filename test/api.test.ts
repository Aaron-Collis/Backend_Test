const mockGetAxios = jest.fn();
const mockPostAxios = jest.fn();
import { z } from "zod";
import { apiHeaders, getData, postData, retry } from "../src/api";
import { URL } from "../src/config";

jest.mock("axios", () => {
  return {
    get: mockGetAxios,
    post: mockPostAxios,
  };
});

describe("Test getData", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  test("Calls the correct endpoint with headers", async () => {
    mockGetAxios.mockResolvedValueOnce({
      status: 200,
      data: "ok",
    });
    await getData("test", z.string());
    expect(mockGetAxios).toHaveBeenCalledTimes(1);
    expect(mockGetAxios).toHaveBeenCalledWith(`${URL}/test`, apiHeaders);
  });
  describe("Gets successful response from api", () => {
    it("With unexpected data throws a parsing error", async () => {
      mockGetAxios.mockImplementationOnce(() => {
        return {
          status: 200,
          data: { test: "An object rather than a string" },
        };
      });
      try {
        await getData("test", z.string());
      } catch (e) {
        expect(e).toEqual(new Error("recceived payload missmatch"));
      }
    });
    it("With correct payload returns the data", async () => {
      mockGetAxios.mockImplementationOnce(() => {
        return {
          status: 200,
          data: "A string",
        };
      });
      const data = await getData("test", z.string());
      expect(data).toEqual("A string");
    });
  });
});

describe("Test postData", () => {
  test("Calls correct endpoint, data and headers", async () => {
    mockPostAxios.mockImplementationOnce(() => {
      return {
        status: 200,
      };
    });
    await postData("test", "test");
    expect(mockPostAxios).toHaveBeenCalledTimes(1);
    expect(mockPostAxios).toHaveBeenCalledWith(
      `${URL}/test`,
      "test",
      apiHeaders
    );
  });
});

describe("Test retry function", () => {
  test("A function that works is only called once", async () => {
    const workingFunction = jest.fn();

    workingFunction.mockImplementationOnce(() => "This works");
    const result = await retry(workingFunction, [], 3);
    expect(workingFunction).toBeCalledTimes(1);
    expect(result).toStrictEqual("This works");
  });

  test("A function that throws an error message is retried 3 times", async () => {
    const errorFunction = jest.fn();
    errorFunction.mockImplementation(() => {
      throw new Error("An error");
    });
    try {
      await retry(errorFunction, [], 3);
    } catch (e) {
      expect(e).toEqual(new Error("All 3 retry attempts exhausted"));
    }
    // Retries 3 times so including 1st attempt is called 4 times
    expect(errorFunction).toBeCalledTimes(4);
  });
  test("A function that fails once is retried", async () => {
    const flakeyFunction = jest.fn();
    flakeyFunction
      .mockImplementationOnce(() => {
        throw new Error("First call fails");
      })
      .mockImplementationOnce(() => "Passes the second time");
      await retry(flakeyFunction, [], 3)
      expect(flakeyFunction).toBeCalledTimes(2)
  });
});
