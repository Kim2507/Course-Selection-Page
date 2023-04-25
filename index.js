class CourseModel{
    #courses;
    constructor(){
        this.#courses=[];
    }

    async fetchCourses(){
        const courses = await API.getList();
        this.courses = courses;
        // console.log(courses);
        return courses;
    }
}


class CourseView{
    constructor(controller){
        this.coursesList1 = document.querySelectorAll(".courses-grid")[0];
        this.coursesList2 = document.querySelectorAll(".courses-grid")[1];
    }

    appendCourse(course,coursesList,i){
        const courseElem = this.createCourseElement2(course,i);
        coursesList.appendChild(courseElem);
    }

    setColor(courseId, courseElem){
        if(courseId % 2 == 0) courseElem.style.backgroundColor = 'white';
        else courseElem.style.backgroundColor = '#FFDB01';
    }

    createCourseElement(course){
        const courseElem = document.createElement("div");
        courseElem.classList.add("grid-item");
        courseElem.id = "unselected";
        this.setColor(course.courseId,courseElem);

        const courseName = document.createElement("p");
        courseName.innerText = course.courseName;

        const courseType = document.createElement("p");
        courseType.innerText = course.required? 'Compulsory' : 'Elective';

        const courseCredit = document.createElement("div");
        courseCredit.classList.add("credit");
        courseCredit.innerText = course.credit;

        courseElem.appendChild(courseName);
        courseElem.appendChild(courseType);
        courseElem.appendChild(courseCredit);
      
        return courseElem;
    }

    createCourseElement2(course, i){
        const courseElem = document.createElement("div");
        courseElem.classList.add("grid-item");
        courseElem.id = "unselected";
       
        this.setColor(i,courseElem);

        const courseName = document.createElement("p");
        courseName.innerText = course.name;

        const courseType = document.createElement("p");
        courseType.innerText = course.isRequired;

        const courseCredit = document.createElement("div");
        courseCredit.classList.add("credit");
        courseCredit.innerText = course.credits;

        courseElem.appendChild(courseName);
        courseElem.appendChild(courseType);
        courseElem.appendChild(courseCredit);
      
        return courseElem;
    }

    renderCourses(courses,coursesList){
        coursesList.innerText="";
        courses.forEach((course) =>{
            const courseElem = this.createCourseElement(course);
            coursesList.appendChild(courseElem);
        })
    }

}

class CourseController{
    #selectedCourses;
    constructor(model, view){
        this.model = model;
        this.view = view;
        this.#selectedCourses = [];
        this.init();
    }

    init(){
        this.model.fetchCourses().then(() =>{
            const courses = this.model.courses;
            this.view.renderCourses(courses,this.view.coursesList1);
        });
        this.selectCourseAction();
        this.updateCreditCounter();
        this.addToSelectedBucket();
    }

    

    selectCourseAction(){
        this.view.coursesList1.addEventListener('click',(e) =>{
            const target = e.target;
            if(target.classList.contains('grid-item')){
                if(target.id === 'unselected'){
                    const prevBackground = target.style.backgroundColor
                    target.id = 'selected';
                    target.style.backgroundColor = 'var(--theme-color-selected, #00BFFF)';
                    target.setAttribute('prev-background-color', prevBackground);
                    // turn the target into object 
                    let courseName = target.children[0].textContent;
                    let required = target.children[1].textContent;
                    let credit = target.children[2].textContent;
                    let courseInfo = {name: courseName, isRequired: required, credits: credit};
                    this.#selectedCourses.push(courseInfo);
                } else if (target.id === 'selected') {
                    target.id = 'unselected';
                    const prevBackgroundColor = target.getAttribute('prev-background-color');
                    target.style.backgroundColor = prevBackgroundColor;
                    target.removeAttribute('prev-background-color');
                    //remove from the array 
                    let index = this.#selectedCourses.findIndex(obj => obj.name === target.children[0].textContent);
                    this.#selectedCourses.slice(index,1);
                    console.log(this.#selectedCourses);
              
                }
               
            }
        })
    }

    updateCreditCounter(){
        this.view.coursesList1.addEventListener('click',(e) =>{
            const target = e.target;
            
            if(target.classList.contains('grid-item')){
                let courseCredit = target.querySelector(".credit");
                let courseCreditValue = parseInt(courseCredit.innerText);
                let counter = document.querySelector(".credit-counter");
                let counterValue = parseInt(counter.innerText);
                if (target.id === 'selected'){
                    counterValue  += courseCreditValue;
                    if(!this.checkValidCredits(counterValue)){
                        counterValue -= courseCreditValue;
                    }
                }else if(target.id === 'unselected'){
                    counterValue  -= courseCreditValue;
                }
                counter.innerText = counterValue.toString();
            }

        })
    }

    checkValidCredits(credits){
        if(credits > 18){
            window.alert("You can only choose up to 18 credits in one semester");
            return false;
        }
        return true;
    }

    openPopup(){
        const credits = document.querySelector(".credit-counter");
        const confirmed = window.confirm("You have chosen " + `${credits.textContent}` + " credits for this semester. You cannot change once you submit. Do you want to confirm?");
        return confirmed;

    }

    action(confirmed){
        if(confirmed){
            for (let i = 0; i < this.#selectedCourses.length; i++) {
                console.log(this.#selectedCourses[i]);
                this.view.appendCourse(this.#selectedCourses[i],this.view.coursesList2,i);

            }
           const availableBucket = document.querySelectorAll("#available .grid-item");
           Array.from(availableBucket).forEach((course) =>{
               if(course.id === 'selected'){
                   // first remove the darkblue color of the
                   course.id = 'unselected';
                   const prevBackgroundColor = course.getAttribute('prev-background-color');
                   course.style.backgroundColor = prevBackgroundColor;
                   course.removeAttribute('prev-background-color');
                        
                }});
       }else{
           console.log("Canceled");
       }
    }

    addToSelectedBucket(){
        const selectBtn = document.querySelector('button');
        selectBtn.addEventListener('click', () => {
            this.action(this.openPopup());
          })
    }

    

    
      
}

const app = new CourseController(new CourseModel(), new CourseView());




    



