import { mysqlTable, primaryKey, varchar } from "drizzle-orm/mysql-core";
import { person } from "./person.schema";
import { departments } from "./departments.schema";

export const personDepartment = mysqlTable('person_department', {
    personId: varchar('person_id', { length: 12 })
        .notNull()
        .references(() => person._id, {
            onDelete: 'cascade'
        }),
    departmentId: varchar('department_id', { length: 12 })
        .notNull()
        .references(() => departments._id, {
            onDelete: 'cascade'
        }),
}, (t) => [
    primaryKey({ columns: [t.personId, t.departmentId] })
])