function numberCounter(target_frame, target_number) {
    //console.log("target_frame : "+target_frame);
    //console.log("target_number : "+target_number);
    this.count = 0; this.diff = 0;
    this.target_count = parseInt(target_number);
    this.target_frame = document.getElementById(target_frame);
    this.timer = null;
    
    this.counter= function() {
        var self = this;
        this.diff = this.target_count - this.count;
    
        //console.log(this.target_count);
        //console.log(this.count);
        if(this.diff > 0) {
            self.count += Math.ceil(this.diff /5);
        }
    
        this.target_frame.innerHTML = this.count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    
        if(this.count < this.target_count) {
            this.timer = setTimeout(function() { self.counter(); }, 20); 
        } else {
            clearTimeout(this.timer);
        }
    };
    
    this.counter();
};
/*
numberCounter.prototype.counter = function() {
    var self = this;
    this.diff = this.target_count - this.count;

    if(this.diff > 0) {
        self.count += Math.ceil(this.diff / 5);
    }

    this.target_frame.innerHTML = this.count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    if(this.count < this.target_count) {
        this.timer = setTimeout(function() { self.counter(); }, 80); // 뒤 인자를 바꿈으로써 속도 조절이 가능함
    } else {
        clearTimeout(this.timer);
    }
};*/

/*
new numberCounter("counter3", 5); // class와 변수를 맞춰주어야 함
new numberCounter("counter2", 11236);
new numberCounter("counter1", 213115);
new numberCounter("counter4", 901512);
new numberCounter("counter5", 24.352);
new numberCounter("counter6", 3957);
*/