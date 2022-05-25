const sendResponse = require("../helpers/response");
const httpStatus = require("http-status");

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
        // chances: "HIGH CHANCE OF PREGNANCY DAY",
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
    console.log(lmpp);
    const cycleLen = 28;
    //date
    const newdate = new Date(lmpp);
    const lmp = new Date(newdate);

    Date.prototype.addDays = function (days) {
      const date = new Date(this.valueOf());
      date.setDate(date.getDate() + days);
      return date;
    };

    //periodLen
    const period = parseInt(periodLen);
    const getNeutralDays = new Array(90).fill(1).map((day, dayCount) => {
      lmp.setDate(lmp.getDate());

      let formattedDate = lmp.toISOString().substr(0, 10);

      return {
        day: dayCount + 1,
        start_date: formattedDate,
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
    // console.log(getAllCycles)
    const getType = (count, period, cycleLength) => {
      const ovulationCount = cycleLength - 14;

      if (count <= period) {
        return {
          chances: "LOW CHANCE OF PREGNANCY",
          title: "Menstrual",
        };
      } else if (count >= period + 1 && count <= ovulationCount - 1) {
        return {
          chances: "HIGH CHANCE OF PREGNANCY",
          title: "Follicular",
        };
      } else if (count >= ovulationCount && count < ovulationCount + 5) {
        return {
          chances: "MEDIUM CHANCE OF PREGNANCY",
          title: "Ovulation",
        };
      } else if (count >= ovulationCount + 5 && count < ovulationCount + 16) {
        return {
          chances: "MEDIUM CHANCE OF PREGNANCY",
          title: "Luteal",
        };
      } else {
        return {
          chances: "LOW CHANCE OF PREGNANCY",
          title: "Default",
        };
      }
    };

    const getCycleInfo = getAllCycles
      .map((cycleList) =>
        cycleList.map((cycle, dayCount) => {
          let startfollicle;
          let endfollicle;
          let titleType = getType(dayCount + 1, period, cycleLen).title;
          switch (titleType) {
            case "Menstrual":
              console.log("M");
              if (cycle.day >= 1 && cycle.day <= 5) {
                //clear
                const startdate = new Date(
                  newdate.addDays(0).toISOString().substr(0, 10)
                );
                const enddate = new Date(
                  newdate.addDays(5).toISOString().substr(0, 10)
                );
                startfollicle = new Date(startdate).toISOString().substr(0, 10);
                endfollicle = new Date(enddate).toISOString().substr(0, 10);
              } else if (cycle.day >= 29 && cycle.day <= 33) {
                const startdate = new Date(
                  newdate.addDays(30).toISOString().substr(0, 10)
                );
                const enddate = new Date(
                  newdate.addDays(35).toISOString().substr(0, 10)
                );
                startfollicle = new Date(startdate).toISOString().substr(0, 10);
                endfollicle = new Date(enddate).toISOString().substr(0, 10);
              } else if (cycle.day >= 57 && cycle.day <= 61) {
                const startdate = new Date(
                  newdate.addDays(57).toISOString().substr(0, 10)
                );
                const enddate = new Date(
                  newdate.addDays(62).toISOString().substr(0, 10)
                );
                startfollicle = new Date(startdate).toISOString().substr(0, 10);
                endfollicle = new Date(enddate).toISOString().substr(0, 10);
              } else if (cycle.day >= 85 && cycle.day <= 90) {
                const startdate = new Date(
                  newdate.addDays(86).toISOString().substr(0, 10)
                );
                const enddate = new Date(
                  newdate.addDays(91).toISOString().substr(0, 10)
                );
                startfollicle = new Date(startdate).toISOString().substr(0, 10);
                endfollicle = new Date(enddate).toISOString().substr(0, 10);
              }
              break;
            case "Follicular":
              console.log("F");
              if (cycle.day >= 6 && cycle.day <= 13) {
                const startdate = new Date(
                  newdate.addDays(7).toISOString().substr(0, 10)
                );
                const enddate = new Date(
                  newdate.addDays(14).toISOString().substr(0, 10)
                );
                startfollicle = new Date(startdate).toISOString().substr(0, 10);
                endfollicle = new Date(enddate).toISOString().substr(0, 10);
              } else if (cycle.day >= 34 && cycle.day <= 41) {
                const startdate = new Date(
                  newdate.addDays(35).toISOString().substr(0, 10)
                );
                const enddate = new Date(
                  newdate.addDays(42).toISOString().substr(0, 10)
                );
                startfollicle = new Date(startdate).toISOString().substr(0, 10);
                endfollicle = new Date(enddate).toISOString().substr(0, 10);
              } else if (cycle.day >= 62 && cycle.day <= 69) {
                const startdate = new Date(
                  newdate.addDays(63).toISOString().substr(0, 10)
                );
                const enddate = new Date(
                  newdate.addDays(69).toISOString().substr(0, 10)
                );
                startfollicle = new Date(startdate).toISOString().substr(0, 10);
                endfollicle = new Date(enddate).toISOString().substr(0, 10);
              } else if (cycle.day == 90) {
                const startdate = new Date(
                  newdate.addDays(91).toISOString().substr(0, 10)
                );
                const enddate = new Date(
                  newdate.addDays(94).toISOString().substr(0, 10)
                );
                startfollicle = new Date(startdate).toISOString().substr(0, 10);
                endfollicle = new Date(enddate).toISOString().substr(0, 10);
              }
              break;
            case "Ovulation":
              if (cycle.day >= 14 && cycle.day <= 18) {
                const startdate = new Date(
                  newdate.addDays(14).toISOString().substr(0, 10)
                );
                const enddate = new Date(
                  newdate.addDays(19).toISOString().substr(0, 10)
                );
                startfollicle = new Date(startdate).toISOString().substr(0, 10);
                endfollicle = new Date(enddate).toISOString().substr(0, 10);
              } else if (cycle.day >= 42 && cycle.day <= 46) {
                const startdate = new Date(
                  newdate.addDays(42).toISOString().substr(0, 10)
                );
                const enddate = new Date(
                  newdate.addDays(47).toISOString().substr(0, 10)
                );
                startfollicle = new Date(startdate).toISOString().substr(0, 10);
                endfollicle = new Date(enddate).toISOString().substr(0, 10);
              } else if (cycle.day >= 70 && cycle.day <= 74) {
                const startdate = new Date(
                  newdate.addDays(70).toISOString().substr(0, 10)
                );
                const enddate = new Date(
                  newdate.addDays(75).toISOString().substr(0, 10)
                );
                startfollicle = new Date(startdate).toISOString().substr(0, 10);
                endfollicle = new Date(enddate).toISOString().substr(0, 10);
              }

              break;
            case "Luteal":
              console.log("L");

              if (cycle.day >= 19 && cycle.day <= 28) {
                const startdate = new Date(
                  newdate.addDays(20).toISOString().substr(0, 10)
                );
                const enddate = new Date(
                  newdate.addDays(29).toISOString().substr(0, 10)
                );
                startfollicle = new Date(startdate).toISOString().substr(0, 10);
                endfollicle = new Date(enddate).toISOString().substr(0, 10);
              } else if (cycle.day >= 47 && cycle.day <= 56) {
                const startdate = new Date(
                  newdate.addDays(48).toISOString().substr(0, 10)
                );
                const enddate = new Date(
                  newdate.addDays(57).toISOString().substr(0, 10)
                );
                startfollicle = new Date(startdate).toISOString().substr(0, 10);
                endfollicle = new Date(enddate).toISOString().substr(0, 10);
              } else if (cycle.day >= 75 && cycle.day <= 84) {
                const startdate = new Date(
                  newdate.addDays(76).toISOString().substr(0, 10)
                );
                const enddate = new Date(
                  newdate.addDays(85).toISOString().substr(0, 10)
                );
                startfollicle = new Date(startdate).toISOString().substr(0, 10);
                endfollicle = new Date(enddate).toISOString().substr(0, 10);
              }

              break;

            default:

            // code block
          }

        
          return {
            title: getType(dayCount + 1, period, cycleLen).title,
            start: startfollicle,
            end: endfollicle,
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
