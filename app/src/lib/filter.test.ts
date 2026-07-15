import { describe, expect, it } from "vitest";
import { applyFilters, emptyFilterState, tourMatchesFilters } from "./filter";
import type { Tour } from "@/types/tour";

const baseTour: Tour = {
  id: "t1",
  title: "Hochtour Weissmies",
  startDate: "2026-07-23",
  endDate: "2026-07-24",
  tourType: ["Hochtour"],
  technicalDifficulty: "WS+",
  physicalDifficulty: "A-B",
  experienceLevel: "Sehr erfahren",
  groups: ["Aktive"],
  leaders: [{ name: "Heinz Kasper", role: "TL" }],
  status: "anmeldung_geschlossen",
  destination: { name: "Weissmies", elevation: 4017, type: "summit" },
};

const hikingTour: Tour = {
  id: "t2",
  title: "Wanderung Engstligenalp",
  startDate: "2026-07-21",
  endDate: "2026-07-21",
  tourType: ["Wandern"],
  technicalDifficulty: "T1 - T2",
  physicalDifficulty: "A",
  experienceLevel: "Einsteiger",
  groups: ["Veteranen Gängige"],
  leaders: [{ name: "Urs Stettler", role: "TL" }],
  status: "anmeldung_offen",
  destination: { name: "Engstligenalp", elevation: 1962 },
};

describe("tourMatchesFilters", () => {
  it("matches everything with an empty filter", () => {
    expect(tourMatchesFilters(baseTour, emptyFilterState)).toBe(true);
  });

  it("filters by group (OR within filter)", () => {
    expect(
      tourMatchesFilters(baseTour, { ...emptyFilterState, groups: ["Aktive"] })
    ).toBe(true);
    expect(
      tourMatchesFilters(baseTour, { ...emptyFilterState, groups: ["JO"] })
    ).toBe(false);
  });

  it("cascades tour type and difficulty", () => {
    // matching type, no grades selected -> matches
    expect(
      tourMatchesFilters(baseTour, {
        ...emptyFilterState,
        tourTypes: ["Hochtour"],
      })
    ).toBe(true);
    // matching type + matching grade
    expect(
      tourMatchesFilters(baseTour, {
        ...emptyFilterState,
        tourTypes: ["Hochtour"],
        difficultiesByDiscipline: { Hochtouren: ["WS+"] },
      })
    ).toBe(true);
    // matching type + non-matching grade
    expect(
      tourMatchesFilters(baseTour, {
        ...emptyFilterState,
        tourTypes: ["Hochtour"],
        difficultiesByDiscipline: { Hochtouren: ["L"] },
      })
    ).toBe(false);
  });

  it("filters by condition using range expansion (A-B)", () => {
    expect(
      tourMatchesFilters(baseTour, {
        ...emptyFilterState,
        physicalDifficulties: ["B"],
      })
    ).toBe(true);
    expect(
      tourMatchesFilters(baseTour, {
        ...emptyFilterState,
        physicalDifficulties: ["D"],
      })
    ).toBe(false);
  });

  it("maps 'anmeldung_geschlossen' filter to ausgebucht too", () => {
    const soldOut: Tour = { ...baseTour, status: "ausgebucht" };
    expect(
      tourMatchesFilters(soldOut, {
        ...emptyFilterState,
        registrationStatuses: ["anmeldung_geschlossen"],
      })
    ).toBe(true);
  });

  it("filters by full text over title, destination and leader", () => {
    expect(
      tourMatchesFilters(baseTour, {
        ...emptyFilterState,
        fullTextSearch: "weissmies",
      })
    ).toBe(true);
    expect(
      tourMatchesFilters(baseTour, {
        ...emptyFilterState,
        fullTextSearch: "kasper",
      })
    ).toBe(true);
    expect(
      tourMatchesFilters(baseTour, {
        ...emptyFilterState,
        fullTextSearch: "gletscher",
      })
    ).toBe(false);
  });

  it("filters by date range overlap", () => {
    expect(
      tourMatchesFilters(baseTour, {
        ...emptyFilterState,
        dateFrom: "2026-07-25",
      })
    ).toBe(false);
    expect(
      tourMatchesFilters(baseTour, {
        ...emptyFilterState,
        dateTo: "2026-07-23",
      })
    ).toBe(true);
  });
});

describe("applyFilters", () => {
  it("combines filters with AND across categories", () => {
    const result = applyFilters([baseTour, hikingTour], {
      ...emptyFilterState,
      tourTypes: ["Wandern"],
      experienceLevels: ["Einsteiger"],
    });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("t2");
  });
});
