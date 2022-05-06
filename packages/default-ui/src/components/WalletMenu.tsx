export type WalletOnClickCallback = (wallet: { name: string; address: string }) => void;

export type WalletMenuProps = {
    activeWallet: string;
    availableWallets: [string, string][];
    onClick: WalletOnClickCallback;
};

type WalletItemProps = {
    active?: boolean;
    name: string;
    address: string;
    onClick?: WalletOnClickCallback;
};

function WalletItem({ active, name, address, onClick }: WalletItemProps) {
    return (
        <li
            onClick={
                onClick &&
                (() => {
                    onClick({ name, address });
                })
            }
        >
            {active && <p>(logo)</p>}
            <span>{name}</span>
            <span>{address}</span>
        </li>
    );
}

export default function WalletMenu({ activeWallet, availableWallets, onClick }: WalletMenuProps) {
    return (
        <ul>
            {availableWallets.map(([name, address]) => (
                <WalletItem
                    active={address === activeWallet}
                    name={name}
                    address={address}
                    onClick={onClick}
                />
            ))}
        </ul>
    );
}
