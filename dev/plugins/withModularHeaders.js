const { withDangerousMod, withPlugins } = require("@expo/config-plugins");
const fs = require("fs");
const path = require("path");

const withModularHeaders = (config) => {
  return withDangerousMod(config, [
    "ios",
    async (config) => {
      const file = path.join(config.modRequest.platformProjectRoot, "Podfile");
      const contents = await fs.promises.readFile(file, "utf8");

      // Check if already applied
      if (contents.includes(":modular_headers => true")) {
        return config;
      }

      // Add modular headers for GoogleUtilities and FirebaseCoreInternal
      // This allows us to NOT use "use_frameworks! :linkage => :static" globally
      // while still satisfying Firebase's Swift/ObjC requirements.
      const patch = `
  pod 'GoogleUtilities', :modular_headers => true
  pod 'FirebaseCoreInternal', :modular_headers => true
`;

      const newContents = contents.replace(
        /use_react_native!\(/,
        `${patch}\n  use_react_native!(`
      );

      await fs.promises.writeFile(file, newContents, "utf8");
      return config;
    },
  ]);
};

module.exports = withModularHeaders;
