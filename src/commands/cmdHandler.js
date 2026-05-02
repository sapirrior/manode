export async function handleCommand(command) {
  // Strip the leading colon if present
  const cmdName = command.startsWith(":") ? command.slice(1) : command;
  
  try {
    const { execute } = await import(`./cmds/${cmdName}.js`);
    await execute();
  } catch (err) {
    if (err.code === "ERR_MODULE_NOT_FOUND") {
      process.stderr.write(`fatal: unknown command "${cmdName}"\n`);
    } else {
      process.stderr.write(`fatal: command failure "${cmdName}" - ${err.message}\n`);
    }
    process.exit(128);
  }
}
