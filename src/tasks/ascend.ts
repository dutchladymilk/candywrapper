import {
  cliExecute,
  handlingChoice,
  myAdventures,
  myDaycount,
  runChoice,
  visitUrl,
} from "kolmafia";
import { $class, $item, $path, ascend, CursedMonkeyPaw, have } from "libram";

import { args } from "../args";

import { targetPerms } from "./perm";
import { Quest } from "./structure";
import { toMoonSign, totallyDrunk } from "./utils";

export function AscendQuest(): Quest {
  return {
    name: "Ascend",
    ready: () => myAdventures() === 0 && totallyDrunk(),
    completed: () => myDaycount() === 1,
    tasks: [
      {
        name: "Do the Ascension",
        ready: () =>
          have($item`Pizza of Legend`) &&
          have($item`Deep Dish of Legend`) &&
          have($item`Calzone of Legend`),
        completed: () => myDaycount() === 1, //Change this
        do: (): void => {
          const [skills, permLifestyle] = targetPerms();

          const skillsToPerm = new Map();
          skills.forEach((sk) => skillsToPerm.set(sk, permLifestyle));

          const path = args.cs
            ? $path`Community Service`
            : args.smol
            ? $path`A Shrunken Adventurer am I`
            : args.casual
            ? $path.none
            : args.robot
            ? $path`You, Robot`
            : undefined;
          const lifestyle = args.casual ? 1 : 2;

          if (path === undefined) throw "You have no path defined";

          const canRobotNonMon = CursedMonkeyPaw.have() && have($item`genie bottle`);
          const moonsign =
            args.robot && canRobotNonMon
              ? toMoonSign("mongoose")
              : args.robot
              ? toMoonSign("vole")
              : toMoonSign(args.moonsign);
          const myClass = args.robot && !canRobotNonMon ? $class`Pastamancer` : args.class;

          ascend({
            path: path,
            playerClass: myClass,
            lifestyle: lifestyle,
            moon: moonsign,
            consumable: $item`astral six-pack`,
            pet: args.astralpet === $item`none` ? undefined : args.astralpet,
            permOptions: { permSkills: skillsToPerm, neverAbort: false },
          });
          cliExecute("refresh all");
          visitUrl("main.php");
          if (args.smol || args.robot) {
            while (handlingChoice()) runChoice(1);
          }
        },
      },
    ],
  };
}
