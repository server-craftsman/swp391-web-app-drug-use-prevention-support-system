import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import type { Course } from "../../../../types/course/Course.res.type";
import { ROUTER_URL } from "../../../../consts/router.path.const";
import CourseCardImage from "./CourseCardImage.com.tsx";
import CourseCardContent from "./CourseCardContent.com.tsx";
import CourseCardHover from "./CourseCardHover.com.tsx";

interface CourseCardProps {
    course: Course;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
    const [isHovered, setIsHovered] = useState(false);

    const courseDetailUrl = ROUTER_URL.CLIENT.COURSE_DETAIL.replace(
        ":courseId",
        course.id.toString()
    );

    return (
        <motion.div
            className="relative h-full"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            whileHover={{ y: -4 }}
            style={{ zIndex: isHovered ? 10001 : 1 }}
        >
            <Link to={courseDetailUrl} className="block">
                <div className="group relative overflow-hidden rounded-2xl bg-white shadow-md hover:shadow-lg transition-shadow duration-300 h-full">
                    <CourseCardImage course={course} />
                    <CourseCardContent course={course} />
                </div>
            </Link>

            {/* Hover Overlay */}
            <AnimatePresence>
                {isHovered && (
                    <div
                        className="fixed inset-0 pointer-events-none z-[10000]"
                        style={{ zIndex: 10000 }}
                    >
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="absolute pointer-events-auto"
                            style={{
                                top: 0,
                                left: '100%',
                                marginLeft: '1rem',
                                zIndex: 10001
                            }}
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                        >
                            <CourseCardHover course={course} />
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default CourseCard; 