import React, { useState } from 'react';
import { X, BookOpen, ScrollText, Shield, Archive, Coins, User } from 'lucide-react';
import { GROCERY_ITEMS } from '../data/items';

interface HistoryDossierModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HistoryDossierModal: React.FC<HistoryDossierModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'ITEMS' | 'HISTORY' | 'MECHANISM' | 'GALLERY'>('ITEMS');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[85vh] bg-[#221a14] border-2 border-[#5c422b] rounded-lg shadow-2xl p-5 text-[#f5ebd7] flex flex-col font-serif overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#4d3723] pb-3 shrink-0">
          <div className="flex items-center gap-2">
            <Archive className="w-5 h-5 text-[#f59e0b]" />
            <h2 className="text-lg font-bold text-[#fef3c7]">
              時代密卷：1950年代台灣白色恐怖與柑仔店歷史檔案
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#a89985] hover:text-[#fff] hover:bg-[#382b20] rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 p-1 bg-[#18130f] border border-[#3e2b1b] rounded my-3 shrink-0">
          <button
            onClick={() => setActiveTab('ITEMS')}
            className={`flex-1 py-1.5 px-3 rounded text-xs font-bold transition-colors ${
              activeTab === 'ITEMS'
                ? 'bg-[#3b291a] text-[#fef08a] shadow'
                : 'text-[#a3937e] hover:text-[#f5ebd7]'
            }`}
          >
            日用雜貨與違禁品
          </button>
          <button
            onClick={() => setActiveTab('HISTORY')}
            className={`flex-1 py-1.5 px-3 rounded text-xs font-bold transition-colors ${
              activeTab === 'HISTORY'
                ? 'bg-[#3b291a] text-[#fef08a] shadow'
                : 'text-[#a3937e] hover:text-[#f5ebd7]'
            }`}
          >
            白色恐怖背景
          </button>
          <button
            onClick={() => setActiveTab('MECHANISM')}
            className={`flex-1 py-1.5 px-3 rounded text-xs font-bold transition-colors ${
              activeTab === 'MECHANISM'
                ? 'bg-[#3b291a] text-[#fef08a] shadow'
                : 'text-[#a3937e] hover:text-[#f5ebd7]'
            }`}
          >
            奇幻動態貨架
          </button>
          <button
            onClick={() => setActiveTab('GALLERY')}
            className={`flex-1 py-1.5 px-3 rounded text-xs font-bold transition-colors ${
              activeTab === 'GALLERY'
                ? 'bg-[#3b291a] text-[#fef08a] shadow'
                : 'text-[#a3937e] hover:text-[#f5ebd7]'
            }`}
          >
            企劃與人物設定
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-3 text-xs leading-relaxed text-[#d6c7b3]">
          {activeTab === 'ITEMS' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {Object.values(GROCERY_ITEMS).map((item) => (
                <div
                  key={item.id}
                  className="p-3 bg-[#191410] border border-[#423020] rounded flex items-start gap-3"
                >
                  <span className="text-2xl p-1 bg-[#261d15] rounded border border-[#3e2b1d]">
                    {item.icon}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#fef3c7]">{item.name}</span>
                      <span
                        className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${
                          item.category === 'CONTRABAND'
                            ? 'bg-[#451010] text-[#fca5a5] border border-[#7f1d1d]'
                            : 'bg-[#1e3a24] text-[#86efac]'
                        }`}
                      >
                        {item.tag}
                      </span>
                    </div>
                    <div className="text-[#a89883] text-[11px] mt-1">{item.description}</div>
                    <div className="text-[#ca8a04] font-mono text-[10px] mt-1 font-bold">
                      當代售價：NT$ {item.price} 元
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'HISTORY' && (
            <div className="flex flex-col gap-3">
              <div className="p-3.5 bg-[#1a1410] border border-[#443021] rounded">
                <h3 className="font-bold text-[#fef08a] text-sm mb-1">
                  一、 1950–1960年代台灣白色恐怖歷史縱深
                </h3>
                <p>
                  1949年5月19日，台灣省警備總司令部宣布全省戒嚴。在長達三十八年的戒嚴體制下，出版、言論、集會結社遭到嚴密監控。「保密防諜」、「檢舉匪諜」的警語貼遍大街小巷，便衣特務與憲兵四處巡邏，任何持有禁書、宣傳自由民主或社會主義思想者，皆可能遭到情治機關夜半帶走，甚至送往綠島管訓。
                </p>
              </div>

              <div className="p-3.5 bg-[#1a1410] border border-[#443021] rounded">
                <h3 className="font-bold text-[#fef08a] text-sm mb-1">
                  二、 《自由中國》雜誌與雷震案
                </h3>
                <p>
                  由雷震、胡適、殷海光等人創辦的《自由中國》半月刊，是五〇年代台灣知識界追求民主、言論自由與憲政體制的重要陣地。雜誌因發表多篇反對國民黨一黨專政與反對蔣介石三度連任的批判言論，最終於1960年遭到查禁，雷震等人被捕入獄，史稱「雷震事件」。
                </p>
              </div>

              <div className="p-3.5 bg-[#1a1410] border border-[#443021] rounded">
                <h3 className="font-bold text-[#fef08a] text-sm mb-1">
                  三、 柑仔店作為民間情報與避難網絡的社會意義
                </h3>
                <p>
                  在早年台灣社會，街角的柑仔店不僅販售油鹽醬醋、寄藥包與黑松汽水，更是街坊鄰里聚集、交換消息的中心。遊戲設想了一間表面平實、暗藏空間魔法與機械機關的奇幻雜貨店，店員扮演庇護者，在威權監視的陰影下以智慧守護良善與自由。
                </p>
              </div>
            </div>
          )}

          {activeTab === 'MECHANISM' && (
            <div className="flex flex-col gap-3">
              <div className="p-3.5 bg-[#1a1410] border border-[#443021] rounded">
                <h3 className="font-bold text-[#fef08a] text-sm mb-1">
                  1. 動態滑軌大貨架（視線阻隔機構）
                </h3>
                <p>
                  店內鋪設青銅嵌地滑軌，臨窗大貨架配備輕量化輪軸。當憲兵自暗巷巡邏逼近時，店員可推動貨架平移至店門與窗櫺前，徹底阻絕手電筒視線探照。貨架更具備雙面翻轉結構，能於瞬間將禁書旋轉翻入暗格，外表僅顯露明星香水皂與罐頭。
                </p>
              </div>

              <div className="p-3.5 bg-[#1a1410] border border-[#443021] rounded">
                <h3 className="font-bold text-[#fef08a] text-sm mb-1">
                  2. 收銀櫃檯雙重機械桿與旋轉書櫃
                </h3>
                <p>
                  收銀機底座配備雙重聯動機關桿。一側操縱走道滑軌解鎖，另一側連動後方巨大木造書櫃。向後扳動時，千斤頂重錘使書櫃側旋90度，露出一條直通台北城南地下防空洞與秘密避難所的石階密道。
                </p>
              </div>

              <div className="p-3.5 bg-[#1a1410] border border-[#443021] rounded">
                <h3 className="font-bold text-[#fef08a] text-sm mb-1">
                  3. 視線扇形偵測（FOV Line of Sight）
                </h3>
                <p>
                  模擬憲兵巡邏時的視覺盲區。警察停步觀察時會釋放扇形錐狀探照光束。玩家必須在光束穿透店面之前完成掩護與貨架布局，確保店內無任何違禁品曝露在射線之中。
                </p>
              </div>
            </div>
          )}

          {activeTab === 'GALLERY' && (
            <div className="flex flex-col gap-3">
              <div className="p-3 bg-[#1a1410] border border-[#443021] rounded flex flex-col gap-2">
                <h3 className="font-bold text-[#fef08a] text-sm">
                  企劃案原創素材參考展示
                </h3>
                <p className="text-[11px] text-[#b3a18a]">
                  本遊戲依據您所上傳的企劃書與設計草圖建立：包含了雜貨店老闆三視圖設計、收銀機關系統、梅花舊台幣硬幣，以及等角立體（Isometric）店內全景與戰術小地圖。
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                  <div className="p-2 bg-[#120e0b] border border-[#3b2718] rounded flex flex-col gap-1">
                    <span className="text-[10px] text-[#ca8a04] font-bold">
                      美術參考 1：店內等角透視與警情巡邏
                    </span>
                    <img
                      src="/assets/aistudio/Gemini_Generated_Image_326vhr326vhr326v_a5ae2fbf.jfif"
                      alt="暗巷雜貨店店內透視參考"
                      className="w-full h-36 object-cover rounded border border-[#422e1e]"
                    />
                  </div>
                  <div className="p-2 bg-[#120e0b] border border-[#3b2718] rounded flex flex-col gap-1">
                    <span className="text-[10px] text-[#ca8a04] font-bold">
                      美術參考 2：雜貨店老闆與收銀機關設定
                    </span>
                    <img
                      src="/assets/aistudio/Gemini_Generated_Image_p7u5o5p7u5o5p7u5_ca17b2a5.jfif"
                      alt="雜貨店老闆設計與收銀機"
                      className="w-full h-36 object-cover rounded border border-[#422e1e]"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end pt-3 border-t border-[#443021] shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#422e1e] hover:bg-[#543b27] text-[#fef3c7] rounded text-xs font-bold transition-colors"
          >
            關閉密卷檔案
          </button>
        </div>
      </div>
    </div>
  );
};
