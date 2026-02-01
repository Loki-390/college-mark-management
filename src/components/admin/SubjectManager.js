/**
 * Filters the master subject list based on the user's current selection.
 */
export const filterSubjects = (allSubjects, dept, year, section) => {
  const deptName = dept?.name || dept;
  
  return allSubjects.filter(s => 
    s.dept === deptName && 
    s.year === year && 
    s.section === section
  );
};

/**
 * Formats a new subject entry with the new fields: staff and hours.
 */
export const createSubjectObject = (name, code, dept, year, section, staff, hours) => {
  return {
    id: code,
    name: name,
    dept: dept?.name || dept,
    year: year,
    section: section,
    staff: staff || "Not Assigned",
    hours: hours || "0"
  };
};