


export const calculateDurationInWeeks = (startDate:string, endDate:string):number =>{
    const startDateTime = new Date(startDate);
    const endDateTime = new Date(endDate); //new Date is used to convert the string date to a date object
  
    const durationInMilliseconds =
      endDateTime.getTime() - startDateTime.getTime(); //getTime() returns the number of milliseconds since January 1, 1970
  
    const millisecondsPerWeek = 7 * 24 * 60 * 60 * 1000; // 7 days * 24 hours * 60 minutes * 60 seconds * 1000 milliseconds
  
    const durationInWeeks = Math.ceil(
      durationInMilliseconds / millisecondsPerWeek
    ); //Math.ceil() rounds up the number to the nearest whole number


    return durationInWeeks;
}