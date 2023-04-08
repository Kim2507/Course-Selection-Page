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
    constructor(){
        this.coursesList = document.querySelector(".courses-grid");
    }

    appendCourse(course){
        const courseElem = this.createCourseElement(course);
        this.coursesList.appendChild(courseElem);
    }

    createCourseElement(course){
        const courseElem = document.createElement("div");
        courseElem.classList.add("grid-item");
        courseElem.id = "unselected";
        courseElem.setAttribute("course-id",course.courseId);

        if(course.courseId % 2 == 0) courseElem.style.backgroundColor = 'white';
        else courseElem.style.backgroundColor = 'light blue';

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

    // selectedCourse(course){
    //     if(course)

    // }

    renderCourses(courses){
        this.coursesList.innerText="";
        courses.forEach((course) =>{
            const courseElem = this.createCourseElement(course);
            this.coursesList.appendChild(courseElem);
        })
    }

}

class CourseController{
    constructor(model, view){
        this.model = model;
        this.view = view;
        this.init();
    }

    init(){
        this.model.fetchCourses().then(() =>{
            const courses = this.model.courses;
            this.view.renderCourses(courses);
        });
        this.courseSelected();
        this.updateCreditCounter();
    }

    courseSelected(){
        this.view.coursesList.addEventListener('click',(e) =>{
            const target = e.target;
            console.log(target);
            // if target id is  unselected then select and turn color to dark blue
            // else if target id is selected then remove color;
            if(target.classList.contains('grid-item')){
                console.log(target);
                if(target.id === 'unselected'){
                    // change the color
                    // store the prev background first 
                    const prevBackground = target.style.backgroundColor
                    target.id = 'selected';
                    target.style.backgroundColor = 'var(--theme-color-selected, #00BFFF)';
                    target.setAttribute('prev-background-color', prevBackground);
                } else if (target.id === 'selected') {
                    target.id = 'unselected';
                    const prevBackgroundColor = target.getAttribute('prev-background-color');
                    target.style.backgroundColor = prevBackgroundColor;
                    // remove the data attribute
                    target.removeAttribute('prev-background-color');
                }
            }
        })
    }

    updateCreditCounter(){
        this.view.coursesList.addEventListener('click',(e) =>{
            const target = e.target;
            if(target.classList.contains('grid-item')){
                courseCredit = target.querySelector(".credit");
                courseCreditValue = parseInt(courseCredit.innerText);
                counter = document.querySelector(".credit-counter");
                counterValue = parseInt(counter.innerText);
                if (target.id === 'selected'){
                    counterValue  += courseCreditValue;
                    console.log(counterValue);
                }else if(target.id === 'unselected'){
                    counterValue  -= courseCreditValue;
                }

                counter.innerText = counterValue.toString();
            }

        })
    }
      
}

const app = new CourseController(new CourseModel(), new CourseView());