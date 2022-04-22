import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { Base64 } from "js-base64";
import { JWKPublicInterface } from "arweave/node/lib/wallet";
import Arweave from "arweave";

import * as adapter from "@pianity/arsnap-adapter";
import "@pianity/arsnap-compat";
