import { converFormattedTimeToTimestamp } from "@/helpers/conver-formatted-time-to-timestamp";
import { useMemo, useState } from "react";

export function useFormattedTime(initFormattedTime: string = "") {
  const [formattedTime, setFormattedTime] = useState(initFormattedTime);

  const isFormattedTimeValid = useMemo(() => {
    const formattedTimeArrary = formattedTime.trim().split(" ");
    if (formattedTimeArrary.length === 1 && formattedTimeArrary[0] === "") return true;
    if (formattedTimeArrary.length === 1) {
      if (["d", "h", "m", "s"].includes(formattedTimeArrary[0].slice(-1))) {
        return !isNaN(
          Number(
            formattedTimeArrary[0].substring(0, formattedTimeArrary[0].length - 1),
          ),
        );
      }
      return !isNaN(Number(formattedTimeArrary[0]));
    }

    let isValid = true;
    for (let i = 0; i < formattedTimeArrary.length; i++) {
      if (
        !["d", "h", "m", "s"].includes(formattedTimeArrary[i].slice(-1)) ||
        isNaN(
          Number(
            formattedTimeArrary[i].substring(0, formattedTimeArrary[i].length - 1),
          ),
        )
      ) {
        isValid = false;
        break;
      }
    }
    return isValid;
  }, [formattedTime]);

  const timestamp = useMemo(() => {
    if (!isFormattedTimeValid) return null;
    return converFormattedTimeToTimestamp(formattedTime);
  }, [formattedTime, isFormattedTimeValid]);
    
  return { formattedTime, setFormattedTime, isFormattedTimeValid, timestamp };
}
