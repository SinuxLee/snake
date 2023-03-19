interface ILoadedResource<T> {
    resource: T;
    url: string;
}

class AssetLoader {
    public static async loadResource<T>(url: string): Promise<ILoadedResource<T> | null> {
        return new Promise((resolve, reject) => {
            cc.resources.load(url, (err: Error, asset: cc.Asset) => {
                if (err) return reject(err);

                const loadedResource: ILoadedResource<T> = {
                    resource: asset as T,
                    url: url
                };
                resolve(loadedResource);
            });
        });
    }

    public static async loadTexture(url: string) {
        const loadedResource = await this.loadResource<cc.Texture2D>(url);
        if (loadedResource) {
            const spriteFrame = new cc.SpriteFrame(loadedResource.resource);
            // 使用加载成功的 spriteFrame...
        } else {
            // 处理加载失败的情况...
        }
    }

    public static async loadAudio(url: string) {
        const loadedResource = await this.loadResource<cc.AudioClip>(url);
        if (loadedResource) {
            const audioSource = cc.audioEngine.play(loadedResource.resource, false, 1);
            // 使用加载成功的 audioSource...
        } else {
            // 处理加载失败的情况...
        }
    }
}
