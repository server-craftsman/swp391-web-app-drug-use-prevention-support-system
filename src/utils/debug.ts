// Debug utility functions
export const debugAPI = {
    logProgramEnrollments: (response: any) => {
        console.log("=== Program Enrollments Debug ===");
        console.log("Full response:", response);
        console.log("Response data:", response?.data);
        console.log("Response data.data:", response?.data?.data);

        if (response?.data?.data) {
            response.data.data.forEach((program: any, index: number) => {
                console.log(`Program ${index + 1}:`, {
                    id: program.id,
                    programId: program.programId,
                    name: program.name,
                    joinDate: program.joinDate,
                    hasJoinDate: !!program.joinDate
                });
            });
        }
        console.log("=== End Debug ===");
    }
}; 