export function getValidAutomationId(automationId: string): string{
    automationId = automationId.replaceAll(' ', '-');
    automationId = automationId.toLocaleLowerCase();
    return automationId;
}