import { ref } from 'vue';

export function useTerminal(executeCode: () => void) {
  const terminalOutput = ref('');

  const handleCommand = (command: string) => {
    if (!command.trim()) return;
    
    switch (command.toLowerCase()) {
      case 'clear':
        clearTerminal();
        break;
      case 'help':
        writeToTerminal('Available commands:');
        writeToTerminal('  clear - Clear the terminal');
        writeToTerminal('  help - Show this help message');
        writeToTerminal('  run - Execute the current code');
        break;
      case 'run':
        executeCode();
        break;
      default:
        writeToTerminal(`Command not found: ${command}`);
        writeToTerminal('Type `help` to see available commands');
    }
  };

  const writeToTerminal = (message: string) => {
    terminalOutput.value += `${message}\n`;
  };

  const clearTerminal = () => {
    terminalOutput.value = '';
  };

  return {
    terminalOutput,
    handleCommand,
    writeToTerminal,
    clearTerminal,
  };
}
