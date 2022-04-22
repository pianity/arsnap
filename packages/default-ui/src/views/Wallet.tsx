import * as adapter from "@pianity/arsnap-adapter";

import Balance from "@/components/Balance";
import Transactions from "@/components/Transactions";

export default function Wallet() {
    const address = "kX4Z5hj5znsyxwAIG9yvOf40u3EXTnGv-jL9ALTqPSg";
    return (
        <>
            <Balance address={address} />
            <Transactions address={address} />
        </>
    );
}
