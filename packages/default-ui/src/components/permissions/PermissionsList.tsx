import { Permission } from "@pianity/arsnap-adapter";

import { classes } from "@/utils/tailwind";
import { PERMISSIONS_DESCRIPTIONS } from "@/views/Settings/Permissions";
import Tooltip from "@/components/interface/Tooltip";
import Text from "@/components/interface/typography/Text";
import helpIconUrl from "@/assets/icons/help.svg";

type PermissionsListProps = {
    permissions: Permission[];
    onRevokeClick: (permission: Permission) => void;
};

export default function PermissionsList({ permissions, onRevokeClick }: PermissionsListProps) {
    type PermissionsItems = Array<{ granted: boolean; permission: Permission }>;

    const grantedPermissionsItems: PermissionsItems = permissions.map((permission) => ({
        granted: true,
        permission,
    }));

    const nonGrantedPermissionsItems: PermissionsItems = Object.keys(PERMISSIONS_DESCRIPTIONS)
        .filter((permission) => !permissions.includes(permission as Permission))
        .map((permission) => ({ granted: false, permission: permission as Permission }));

    const allPermissionsItems = [...grantedPermissionsItems, ...nonGrantedPermissionsItems];

    return (
        <div className={classes("flex flex-col", "w-full pr-4 pl-6 py-6 mb-[14px]")}>
            <Text.h3 color="white" size="12" weight="semibold" wider uppercase className="mb-6">
                Permissions
            </Text.h3>
            <ul>
                {allPermissionsItems.map(({ granted, permission }) => (
                    <li key={permission} className="flex items-center mb-5 last:mb-0">
                        <Text.span size="16" weight="semibold">
                            {permission}
                        </Text.span>
                        <Tooltip text={PERMISSIONS_DESCRIPTIONS[permission].description}>
                            <img src={helpIconUrl} alt="Permission info" className="mx-2" />
                        </Tooltip>
                        {PERMISSIONS_DESCRIPTIONS[permission].dangerous && (
                            <span className="w-2 h-2 bg-orange-dark rounded-full" />
                        )}

                        {granted && (
                            <button className="ml-auto" onClick={() => onRevokeClick(permission)}>
                                <Text.span
                                    color="red-dark"
                                    size="12"
                                    weight="semibold"
                                    wider
                                    uppercase
                                >
                                    Revoke
                                </Text.span>
                            </button>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}
