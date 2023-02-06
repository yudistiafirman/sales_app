import POMachine from '@/machine/PoMachine';
import { useInterpret } from '@xstate/react';
import React, { createContext } from 'react';
import { InterpreterFrom } from 'xstate';

interface IProvider {
  children: React.ReactNode;
}

const PurchaseOrderContext = createContext({
  purchaseOrderService: {} as InterpreterFrom<typeof POMachine>,
});

const PurchaseOrderProvider = (props: IProvider) => {
  const purchaseOrderService = useInterpret(POMachine);

  return (
    <PurchaseOrderContext.Provider value={{ purchaseOrderService }}>
      {props.children}
    </PurchaseOrderContext.Provider>
  );
};

export { PurchaseOrderContext, PurchaseOrderProvider };
