class WoodcuttingQOL {
    modTitle = 'Woodcutting QOL';
    modVersion = '1.0';
    settingsSection = 'General';
    removeLowestLevelSwitch = {
        type: 'switch',
        name: 'remove-lowest-level-tree-enabled',
        label: 'Auto remove lowest level tree',
        hint: 'Automatically unselect the lowest level tree when selecting a new tree to cut.',
        default: true,
    };

    log (msg) {
        console.log(`[${this.modTitle}]: ${msg}`);
    }

    removeLowestLevelTree(tree) {
        const { woodcutting, modifiers } = game;
        const { activeTrees } = woodcutting;
        if(activeTrees.size < 1 + modifiers.increasedTreeCutLimit)
            return;
        if(activeTrees.has(tree))
            return;

        const lowLevel = Array.from(activeTrees).reduce(
            (prev, cur) => prev.level < cur.level ? prev : cur);
        activeTrees.delete(lowLevel);
    }
}

let ctx = mod.getContext(import.meta);
export function setup() {
    let wcQOL = new WoodcuttingQOL();
    ctx.settings.section(wcQOL.settingsSection).add(wcQOL.removeLowestLevelSwitch);
    ctx.patch(Woodcutting, 'selectTree').before(tree => {
        if(ctx.settings.section(wcQOL.settingsSection).get(wcQOL.removeLowestLevelSwitch.name))
            wcQOL.removeLowestLevelTree(tree);
    });
    wcQOL.log('loaded!');
}