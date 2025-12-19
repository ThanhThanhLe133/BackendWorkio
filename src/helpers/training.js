const summarizeParticipation = (candidateEntry = {}) => ({
    candidate_id: candidateEntry.candidate_id,
    status: candidateEntry.status,
    attendance: candidateEntry.attendance ?? null,
    tuition_confirmed: Boolean(candidateEntry.tuition_confirmed),
    signed_at: candidateEntry.signed_at || null,
    notes: candidateEntry.notes || null,
});

export const summarizeCourse = (course, candidate_id) => {
    const json = course?.toJSON ? course.toJSON() : course;
    const candidateEntry = Array.isArray(json.candidates)
        ? json.candidates.find((item) => item.candidate_id === candidate_id)
        : null;

    return {
        course_id: json.course_id,
        course_name: json.name,
        center_id: json.center_id,
        center_name: json.center?.name,
        training_field: json.training_field || null,
        occupation_type: json.occupation_type || null,
        summary: json.summary || null,
        details: json.details || null,
        participation: summarizeParticipation(candidateEntry || {}),
        start_date: json.start_date,
        end_date: json.end_date,
    };
};

export const summarizeCourses = (courses = [], candidate_id) =>
    courses.map((course) => summarizeCourse(course, candidate_id));
