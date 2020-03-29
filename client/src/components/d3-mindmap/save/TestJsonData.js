/**
 * Project:  valueinfinity-mvp
 * File:     /client/src/components/d3-mindmap/MindmapLayout.js
 * Descr:    JSON test data for testing the D3 mond map.
 * Created:  2019-10-02
 * Author:   Brad Kaufman
 */
export const jsonTestData = {
  id: "_ns1nvi0ai",
  name: "Root",
  note: "Prioritization",
  children: [
    {
      id: "_o4r47dq71",
      name: "Reduce operating costs",
      note:
        "Look to reduce operating costs throughout all divisions and locations.  Start with aggregating data.",
      children: [
        {
          id: "_al6om6znz",
          name: "Reduce inventory",
          note: "Look to reduce inventory after review of parts.",
          children: []
        },
        {
          id: "_z3uk0721f",
          name: "Operating procedures",
          note: "Initial review of operating procedures."
        }
      ]
    },
    {
      id: "_uajrljib9",
      name: "Review supply chain processes",
      note: "Perform supply chain review of all steps."
    },
    {
      id: "_uguzpgdta",
      name: "Introduce automation",
      note: "Begin to use automation at all locations and sites.",
      children: [
        {
          id: "_t8ln1vlwa",
          name: "Review supply chain",
          note: "Begin review of supply chain...",
          children: []
        },
        {
          id: "_c96w1yrth",
          name: "Perform failover testing",
          note: "Take sites offline to check failover capabilities",
          children: []
        }
      ]
    }
  ]
};
export const jsonTestData2 = {
  id: "_ns1nvi0ai",
  name: "Root",
  note: "Prioritization",
  children: [
    {
      id: "_o4r47dq71",
      name: "Reduce operating costs",
      note:
        "Look to reduce operating costs throughout all divisions and locations.  Start with aggregating data.",
      children: [
        {
          id: "_al6om6znz",
          name: "Reduce inventory",
          note: "Look to reduce inventory after review of parts.",
          children: [
            {
              id: "_46ct4o4oy",
              name: "Review part models"
            },
            {
              id: "_ea00nojwy",
              name: "Optimize supply chain"
            }
          ]
        },
        {
          id: "_z3uk0721f",
          name: "Operating procedures",
          note: "Initial review of operating procedures."
        }
      ]
    },
    {
      id: "_uajrljib9",
      name: "Review supply chain processes",
      note: "Perform supply chain review of all steps."
    },
    {
      id: "_uguzpgdta",
      name: "Introduce automation",
      note: "Begin to use automation at all locations and sites.",
      children: [
        {
          id: "_6e1egf02s",
          name: "Q"
        },
        {
          id: "_t8ln1vlwa",
          name: "Review supply chain",
          note: "Begin review of supply chain...",
          children: [
            {
              id: "_qzltyy8rn",
              name: "Optimize data flow"
            }
          ]
        }
      ]
    }
  ]
};
