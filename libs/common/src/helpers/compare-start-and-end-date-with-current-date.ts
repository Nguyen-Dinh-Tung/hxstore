import { BadRequestException } from '@nestjs/common';
import { isAfter, isBefore } from 'date-fns';
export function compareStartAndEndDateWithCurrentDate(
  startTime: Date,
  endTime: Date,
) {
  if (isAfter(new Date(startTime), new Date())) {
    throw new BadRequestException('ERROR_STARTDATE_CAN_NOT_BEFORE_CURRENTTIME');
  }

  if (!isBefore(new Date(endTime), new Date())) {
    throw new BadRequestException('ERROR_ENDDATE_CAN_NOT_BEFORE_CURRENTTIME');
  }

  if (isBefore(new Date(endTime), new Date(startTime))) {
    throw new BadRequestException('ERROR_ENDDATE_CAN_NOT_BEFORE_STARTDATE');
  }
}

export function compareStartAndEndDateAfterCurrentDate(
  startTime: Date,
  endTime: Date,
) {
  if (isBefore(new Date(startTime), new Date())) {
    throw new BadRequestException('ERROR_STARTDATE_MUST_BE_AFTER_CURRENTTIME');
  }

  if (isBefore(new Date(endTime), new Date())) {
    throw new BadRequestException('ERROR_ENDDATE_MUST_BE_AFTER_CURRENTTIME');
  }

  if (isBefore(new Date(endTime), new Date(startTime))) {
    throw new BadRequestException('ERROR_ENDDATE_CAN_NOT_BEFORE_STARTDATE');
  }
}
