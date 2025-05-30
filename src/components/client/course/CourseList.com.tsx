import CourseCard from "./CourseCard.com";
import courseData from "../../../data/course.json";

export default function CourseList() {
  return (
    <div className="flex flex-wrap">
      {courseData.map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  );
}
