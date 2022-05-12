const sendResponse = require("../helpers/response");
const httpStatus = require("http-status");

const getPeriodData = (lmp, cycle, period) => {
  const calculateNextPeriod = (lastPeriod, cycle, periodLength) => {
    const periodDays = new Array(periodLength).fill(1);
    lastPeriod.setDate(lastPeriod.getDate() + cycle);

    const getPeriodDays = periodDays.map((day, dayCount) => {
      lastPeriod.setDate(lastPeriod.getDate() + day);
      let formattedDate = lastPeriod.toISOString().substr(0, 10);
      return {
        day: dayCount + 1,
        date: formattedDate,
        phase: "period",
        isFertile: false,
        chances: "LOW CHANCE OF PREGNANCY",
      };
    });
    thePeriodLast = getPeriodDays[getPeriodDays.length - 1];
    return getPeriodDays;
  };

  const getPeriodInfo = (d, cycle, periodLength) => {
    const totalDays = new Array(12).fill(1);
    let thePeriodLast = d;
    const getInfo = totalDays.map(() =>
      calculateNextPeriod(thePeriodLast, cycle, periodLength)
    );
    return getInfo;
  };

  const userPeriodInfo = getPeriodInfo(lmp, cycle, period).reduce(
    (acc, val) => acc.concat(val),
    []
  );

  return userPeriodInfo;
};

const getOvulationData = (lastPeriodOvulation, cycle) => {
  const calculateNextOvulation = (lastPeriodOvulation, cycle) => {
    const ovulationDays = new Array(5).fill(1);
    let ovulationCount = 14;
    let ovulationCycle = cycle - ovulationCount;
    lastPeriodOvulation.setDate(lastPeriodOvulation.getDate() + ovulationCycle);

    const getOvulationDays = ovulationDays.map((day, dayCount) => {
      lastPeriodOvulation.setDate(lastPeriodOvulation.getDate() + day);
      let formattedDate = lastPeriodOvulation.toISOString().substr(0, 10);

      return {
        day: ovulationCycle + dayCount,
        phase: "ovulation",
        date: formattedDate,
        isFertile: dayCount === 4,
        chances: "HIGH CHANCE OF PREGNANCY DAY",
      };
    });
    theOvulationLast = getOvulationDays[getOvulationDays.length - 1];

    return getOvulationDays;
  };

  const getOvulationInfo = (d, cycle) => {
    const totalDays = new Array(12).fill(1);
    let theOvulationLast = d;
    const getInfo = totalDays.map(() =>
      calculateNextOvulation(theOvulationLast, cycle)
    );
    return getInfo;
  };

  const userOvulationInfo = getOvulationInfo(lastPeriodOvulation, cycle).reduce(
    (acc, val) => acc.concat(val),
    []
  );

  return userOvulationInfo;
};


exports.getCycleInfo = async (req, res, next) => {
  try {
    const { lmpp, cycle, periodLen } = req.body;
    const cycleLen = cycle;
    //date
    const newdate = new Date(lmpp);
    const lmp = new Date(newdate.toISOString().substr(0, 10));
    // const lmp = newdate.toISOString().substr(0, 10);
    //periodLen
    const period = periodLen;
    const getNeutralDays = new Array(90).fill(1).map((day, dayCount) => {
      lmp.setDate(lmp.getDate() + day);
      let formattedDate = lmp.toISOString().substr(0, 10);

      return {
        day: dayCount + 1,
        phase: "default",
        start_date: formattedDate,
        isFertile: false,
        chances: "LOW CHANCE OF PREGNANCY DAY",
      };
    });

    let arrayOfCycles = [];

    function splitIntoCycles(cycleLength) {
      while (getNeutralDays.length > 0) {
        let cycleList = getNeutralDays.splice(0, cycleLength);
        arrayOfCycles.push(cycleList);
      }
      return arrayOfCycles;
    }
 
    const getAllCycles = splitIntoCycles(cycleLen);
    const getType = (count, period, cycleLength) => {

      const ovulationCount = cycleLength - 14;

      

    //   const follicle=range(period+1,peri)
      if (count <= period) {
        return {
          chances: "LOW CHANCE OF PREGNANCY",
          phase: "period",
          isFertile: false,
        };
      } 
      else if (count >= period + 1 &&  count <= ovulationCount-1) {
        return {
          chances: "HIGH CHANCE OF PREGNANCY",
          phase: "follical",
          isFertile: true,
        };
      }
      else if (count === ovulationCount + 4) {
        return {
          chances: "HIGH CHANCE OF PREGNANCY",
          phase: "ovulation",
          isFertile: true,
        };
      } else if (count >= ovulationCount && count < ovulationCount + 4) {
        return {
          chances: "MEDIUM CHANCE OF PREGNANCY",
          phase: "ovulation",
          isFertile: false,
        };
      } else if (count > ovulationCount + 4 && count <= ovulationCount + 6) {
        return {
          chances: "MEDIUM CHANCE OF PREGNANCY",
          phase: "ovulation",
          isFertile: false,
        };
      } else {
        return {
          chances: "LOW CHANCE OF PREGNANCY",
          phase: "lutheal",
          isFertile: false,
        };
      }
    };

    const getCycleInfo = getAllCycles
      .map((cycleList) =>
        cycleList.map((cycle, dayCount) => {
          return {
            ...cycle,
            day: dayCount + 1,
            chances: getType(dayCount + 1, period, cycleLen).chances,
            phase: getType(dayCount + 1, period, cycleLen).phase,
            isFertile: getType(dayCount + 1, period, cycleLen).isFertile,

          };
        })
      )
      .flat();

    return res.json(sendResponse(httpStatus.OK, "success", getCycleInfo));
  } catch (err) {
    console.log(err);
    res.json(
      sendResponse(
        httpStatus.BAD_REQUEST,
        "Unable to get cycle info",
        null,
        err
      )
    );
  }
};
