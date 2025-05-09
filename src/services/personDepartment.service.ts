import { getDB } from "@db/client";
import { departments } from "@schema/sql/departments.schema";
import { personDepartment } from "@schema/sql/personDepartment.schema";
import { eq, and, inArray } from "drizzle-orm";

export const addDepartmentsToPerson = async (personId: string, departmentIds: string[]) => {
    const db = getDB();
    if (db.type === "mysql") {
        return db.client.insert(personDepartment)
            .values(departmentIds.map(departmentId => ({
                personId,
                departmentId
            })))
            .execute();
    }
};

export const getPersonDepartments = async (personId: string) => {
    const db = getDB();
    if (db.type === "mysql") {
        return db.client.select({
            departmentId: departments._id,
            departmentName: departments.name,
        })
            .from(personDepartment)
            .where(eq(personDepartment.personId, personId))
            .leftJoin(departments, (eq(departments._id, personDepartment.departmentId)))
            .execute();
    }
};

export const removeDepartmentsFromPerson = async (personId: string, departmentIds: string[]) => {
    const db = getDB();
    if (db.type === "mysql") {
        return db.client.delete(personDepartment)
            .where(
                and(
                    eq(personDepartment.personId, personId),
                    inArray(personDepartment.departmentId, departmentIds)
                )
            )
            .execute();
    }
};

export const setPersonDepartments = async (personId: string, departmentIds: string[]) => {
    const db = getDB();
    if (db.type === "mysql") {
        await db.client.transaction(async (tx) => {
            // Clear existing relationships
            await tx.delete(personDepartment)
                .where(eq(personDepartment.personId, personId));

            // Insert new relationships
            if (departmentIds.length > 0) {
                await tx.insert(personDepartment)
                    .values(departmentIds.map(departmentId => ({
                        personId,
                        departmentId
                    })));
            }
        });
    }
};