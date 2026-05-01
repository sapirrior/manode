export async function handleCommand(command) {
  // Strip the leading colon if present
  const cmdName = command.startsWith(":") ? command.slice(1) : command;
  
  try {
    const { execute } = await import(`./cmds/${cmdName}.js`);
    await execute();
  } catch (err) {
    if (err.code === "ERR_MODULE_NOT_FOUND") {
      console.error(`error: unknown command "${cmdName}"`);
    } else {
      console.error(`error: command failure "${cmdName}" - ${err.message}`);
    }
  }
}
