	/*
     	Creating a class for Log Source which will contain constructor for initializing values
    */
	   class Log_Source{
	     constructor(){
		    this.isDrained = false;
			   // Each entry is a simple javascript object with a timestamp and message.
			this.last = {    
						date: new Date(Date.now() - (1000 * 60 * 60 * 24 * _.random(40, 60))),     // Present in lodash.js
					    msg: faker.fake("{{company.catchPhrase}}")   // for faking the messages
			}
	     }
		 
		  getNextPseudoRandomEntry() {
		     return {
			     date: new Date(this.last.date.getTime() + (1000 * 60 * 60 * _.random(10)) + _.random(1000* 60)),
			     msg: faker.fake("{{company.catchPhrase}}")
		    }
	    }

	       pop() {
		      this.last = this.getNextPseudoRandomEntry()
		      if (this.last.date > new Date()) {
			      this.isDrained = true
		        }
		      return this.isDrained ? false : this.last
	    }

	       popAsync() {
		       this.last = this.getNextPseudoRandomEntry()
		       if (this.last.date > Date.now()) {
		        	this.isDrained = true
		        }
				// Using Promise E6
		      return P.delay(_.random(8)).then(() => this.isDrained ? false : this.last)
	    }
		 
    }
	
	noOfSources = 200;           // Each source is comprised of N log entries.
	const syncLogSources = []
    for (let i = 0; i < noOfSources; i++) {
	    syncLogSources.push(new Log_Source());
    }
   	
   /*
      To print out all of the entries, across all of the sources, in chronological order. 
    */	 
	class Printer {
	constructor() {
		this.last = new Date(0)
		this.logsPrinted = 0
	}
	
      // To print the logs
	print(log) {
		if (!_.isDate(log.date)) {
			throw new Error(log.date + " is not a date")
		}
		if (log.date >= this.last) {
			console.log(log.date, log.msg)   // It will print date and message
		} else {
			throw new Error(log.date + " is not greater than " + this.last)
		}
		this.last = log.date;
		this.logsPrinted++;   // Count the logs
		if (this.logsPrinted === 1) {
			this.startTime = new Date();
		}
	}

	completed() {          // Log description
		var timeTaken = (new Date() - this.startTime) / 1000;
		console.log("\n**********Log Details**************");
		console.log("No. of Logs printed:\t\t", this.logsPrinted);
		console.log("Time taken (s):\t\t\t", timeTaken);
		console.log("Logs/sec:\t\t\t\t", this.logsPrinted / timeTaken);
		console.log("***********************************\n");
	}
}

	let merged = [];
	let printer = new Printer();        // Creating an object of Printer()
	syncLogSources.forEach(item => {
		let temp = [item.pop()];
		while(item.isDrained){       
			temp = item.pop();
		}
		for(let i = 0, len = temp.length; i < len; i++){
			merged.push(temp[i]);
		}
	});

	merged.sort((a, b) => a.date - b.date).forEach(item => printer.print(item));
	printer.completed();