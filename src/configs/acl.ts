import { AbilityBuilder, Ability } from "@casl/ability";

export type Subjects = string;
export type Actions = "manage" | "create" | "read" | "update" | "delete";
export type AppAbility = Ability<[Actions, Subjects]> | undefined;

export const AppAbility = Ability as any;

export type ACLObj = {
  action: Actions;
  subject: Subjects;
};

const defineRulesFor = (role: string, subject: string) => {
  const { can, rules } = new AbilityBuilder(AppAbility);

  /**
   *  mange - represents any action
   *  all - represents any subject
   */

  switch (role) {
    case "admin":
      can("manage", "all");
      break;
    case "user":
      can("read", "dashboard");
      break;
    case "receptionist":
      can("read", "upcoming checkup");
      can(["read", "create", "update"], ["patient", "vital signs"]);
      break;
    case "physician":
      can("read", ["physician", "my patient", "today's checkup"]);
      can(["read", "create", "update"], ["physical checkup"]);
      can(["read", "update"], "appointment");

      break;
    default:
      can(["read", "create", "update", "delete"], subject);
      break;
  }

  return rules;
};

export const buildAbilityFor = (role: string, subject: string): AppAbility => {
  return new AppAbility(defineRulesFor(role, subject), {
    //@ts-ignore
    detectSubjectType: (object) => object!.type,
  });
};

export const defaultACLObj: ACLObj = {
  action: "manage",
  subject: "all",
};

export default defineRulesFor;